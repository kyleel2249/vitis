/**
 * Startup hook. Replit-only Stripe bootstrap (managed webhook + backfill).
 * On every other host (Cloudflare, Docker, Vercel…) this is a no-op, and Stripe
 * webhooks are configured manually in the Stripe dashboard → /api/stripe/webhook.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const databaseUrl = process.env.DATABASE_URL;
  const replitDomain = process.env.REPLIT_DOMAINS?.split(',')[0]?.trim();
  const onReplitStripe = !process.env.STRIPE_SECRET_KEY && !!process.env.REPLIT_CONNECTORS_HOSTNAME;
  if (!databaseUrl || !replitDomain || !onReplitStripe) return;

  try {
    const { runMigrations } = await import('stripe-replit-sync');
    const { getStripeSync } = await import('./src/lib/stripeClient');

    await runMigrations({ databaseUrl });

    const stripeSync = await getStripeSync();
    await stripeSync.findOrCreateManagedWebhook(`https://${replitDomain}/api/stripe/webhook`);

    // Backfill runs in background — don't await so it doesn't block startup
    stripeSync.syncBackfill().catch((err: Error) => {
      console.error('Stripe backfill error:', err.message);
    });
  } catch (err: any) {
    console.warn('Stripe initialization skipped:', err.message);
  }
}
