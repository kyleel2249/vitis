import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripeCredentials, getStripeSync, isReplitStripe } from '@/lib/stripeClient';
import { query } from '@/lib/db';

// Stripe needs the raw payload for signature verification
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const payload = Buffer.from(await req.arrayBuffer());
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    const { secretKey, webhookSecret } = await getStripeCredentials();
    if (!webhookSecret) {
      return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET is not configured' }, { status: 500 });
    }

    // Verify the signature ourselves — works on every host
    const stripe = new Stripe(secretKey);
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    // Optional: keep the Replit stripe-sync tables up to date when running on Replit
    if (isReplitStripe()) {
      try {
        const sync = await getStripeSync();
        await sync.processWebhook(payload, signature);
      } catch (syncErr: any) {
        console.warn('stripe-replit-sync skipped:', syncErr.message);
      }
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntentId = (event.data.object as Stripe.PaymentIntent).id;
      await query(
        `UPDATE orders SET payment_status = 'paid', status = 'confirmed'
         WHERE stripe_payment_intent_id = $1`,
        [paymentIntentId]
      );
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntentId = (event.data.object as Stripe.PaymentIntent).id;
      await query(
        `UPDATE orders SET payment_status = 'failed'
         WHERE stripe_payment_intent_id = $1`,
        [paymentIntentId]
      );
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
