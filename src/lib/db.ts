import { Pool, Client } from 'pg';

declare global {
  var _pgPool: Pool | undefined;
}

/**
 * SSL: managed Postgres (Neon, Supabase, RDS, Render…) requires TLS.
 *  - DATABASE_SSL=true            → TLS on
 *  - DATABASE_SSL=false           → TLS off
 *  - unset                        → TLS on when the URL has sslmode=require or isn't localhost/internal
 */
function sslConfig() {
  const flag = process.env.DATABASE_SSL;
  if (flag === 'false') return undefined;
  const url = process.env.DATABASE_URL || '';
  const needs =
    flag === 'true' ||
    /sslmode=(require|verify-full|verify-ca)/i.test(url) ||
    (!!url && !/@(localhost|127\.0\.0\.1|helium|[a-z0-9-]+\.internal)(:|\/|$)/i.test(url) && process.env.NODE_ENV === 'production');
  return needs ? { rejectUnauthorized: false } : undefined;
}

function createPool() {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not set — database queries will fail until it is configured.');
  }
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: sslConfig(),
    max: Number(process.env.DATABASE_POOL_MAX || 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
}

/**
 * Cloudflare Workers cannot share I/O objects (sockets) between requests, so a
 * long-lived pool hangs the second request. On Workers we open a short-lived
 * connection per call instead (point DATABASE_URL at Hyperdrive/a pooler there).
 */
const isWorkers =
  typeof navigator !== 'undefined' && (navigator as any).userAgent === 'Cloudflare-Workers';

async function withClient<T>(fn: (client: Client) => Promise<T>): Promise<T> {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: sslConfig(),
    connectionTimeoutMillis: 10000,
  });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end().catch(() => {});
  }
}

function getPool(): Pool {
  if (!globalThis._pgPool) globalThis._pgPool = createPool();
  return globalThis._pgPool;
}

// Lazy proxy: importing this module never opens a connection (safe during `next build`).
const pool = new Proxy({} as Pool, {
  get(_t, prop, receiver) {
    const real = getPool() as any;
    const value = Reflect.get(real, prop, real);
    return typeof value === 'function' ? value.bind(real) : value;
  },
});

export default pool;

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  if (isWorkers) {
    return withClient(async (c) => (await c.query(text, params)).rows as T[]);
  }
  const result = await getPool().query(text, params);
  return result.rows as T[];
}

export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

export async function transaction<T>(fn: (client: any) => Promise<T>): Promise<T> {
  if (isWorkers) {
    return withClient(async (client) => {
      try {
        await client.query('BEGIN');
        const result = await fn(client);
        await client.query('COMMIT');
        return result;
      } catch (e) {
        await client.query('ROLLBACK').catch(() => {});
        throw e;
      }
    });
  }
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
