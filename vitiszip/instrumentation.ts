export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { runMigrations } = await import('stripe-replit-sync');
      const { getStripeSync } = await import('./src/lib/stripeClient');

      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) return;

      await runMigrations({ databaseUrl });

      const stripeSync = await getStripeSync();
      const webhookBaseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
      await stripeSync.findOrCreateManagedWebhook(`${webhookBaseUrl}/api/stripe/webhook`);

      // Backfill runs in background — don't await so it doesn't block startup
      stripeSync.syncBackfill().catch((err: Error) => {
        console.error('Stripe backfill error:', err.message);
      });
    } catch (err: any) {
      // Stripe not yet connected — app still starts normally
      console.warn('Stripe initialization skipped:', err.message);
    }
  }
}
