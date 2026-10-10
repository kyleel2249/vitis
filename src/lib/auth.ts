import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { queryOne } from './db';

/** Resolve the secret lazily so Next.js can import route modules during build-time page-data collection. */
function getJwtSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is required for session token operations. Configure it in your deployment environment.');
  }
  return new TextEncoder().encode(secret);
}

export type UserPayload = {
  id: string;
  email: string;
  name: string;
  role: string;
  vendorId?: string;
};

export async function signToken(payload: UserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    if (!process.env.SESSION_SECRET) return null;
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as UserPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return queryOne(
    'SELECT id, email, name, role, avatar_url, created_at FROM users WHERE id = $1 AND is_active = true',
    [session.id]
  );
}
