import Stripe from 'stripe';

type StripeCredentials = { secretKey: string; publishableKey: string; webhookSecret?: string };

/**
 * Credential resolution order:
 *  1. Standard environment variables (works on Cloudflare, Docker, Vercel, any host)
 *     STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY (or NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY), STRIPE_WEBHOOK_SECRET
 *  2. Replit connector API (kept so the original Replit workflow still works)
 * Not cached — the Replit path can rotate tokens.
 */
export async function getStripeCredentials(): Promise<StripeCredentials> {
  const envSecret = process.env.STRIPE_SECRET_KEY;
  if (envSecret) {
    return {
      secretKey: envSecret,
      publishableKey:
        process.env.STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    };
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!hostname || !xReplitToken) {
    throw new Error(
      'Stripe is not configured. Set STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY and STRIPE_WEBHOOK_SECRET ' +
        '(or connect Stripe through the Replit Integrations tab).'
    );
  }

  const resp = await fetch(
    `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=stripe`,
    {
      headers: { Accept: 'application/json', X_REPLIT_TOKEN: xReplitToken },
      signal: AbortSignal.timeout(10_000),
    }
  );

  if (!resp.ok) {
    throw new Error(`Failed to fetch Stripe credentials: ${resp.status} ${resp.statusText}`);
  }

  const data = await resp.json();
  const settings = data.items?.[0]?.settings;

  if (!settings?.secret_key) {
    throw new Error('Stripe integration not connected or missing secret key. Connect Stripe via the Integrations tab first.');
  }

  return {
    secretKey: settings.secret_key,
    publishableKey: settings.publishable_key ?? '',
    webhookSecret: settings.webhook_secret,
  };
}

/** Returns an authenticated Stripe client. */
export async function getUncachableStripeClient(): Promise<Stripe> {
  const { secretKey } = await getStripeCredentials();
  return new Stripe(secretKey);
}

/** Returns the Stripe publishable key (safe to expose to the browser). */
export async function getStripePublishableKey(): Promise<string> {
  const { publishableKey } = await getStripeCredentials();
  return publishableKey;
}

/**
 * Returns a StripeSync instance (Replit-managed Stripe data sync + webhook processing).
 * Loaded dynamically so hosts without the Replit connector never load the package.
 * Only available on Replit; elsewhere webhooks are verified directly (see webhook route).
 */
export async function getStripeSync() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL environment variable is required');

  const { StripeSync } = await import('stripe-replit-sync');
  const { secretKey, webhookSecret } = await getStripeCredentials();
  return new StripeSync({
    poolConfig: { connectionString: databaseUrl },
    stripeSecretKey: secretKey,
    stripeWebhookSecret: webhookSecret ?? '',
  });
}

/** True when the Replit connector (not plain env vars) is the credential source. */
export function isReplitStripe(): boolean {
  return !process.env.STRIPE_SECRET_KEY && !!process.env.REPLIT_CONNECTORS_HOSTNAME;
}
