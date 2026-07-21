import { NextRequest, NextResponse } from 'next/server';
import { getStripeSync } from '@/lib/stripeClient';
import { query } from '@/lib/db';

// Disable body parsing — Stripe needs the raw payload for signature verification
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const payload = Buffer.from(await req.arrayBuffer());
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    // Let stripe-replit-sync handle webhook verification and data sync
    const stripeSync = await getStripeSync();
    const event = await stripeSync.processWebhook(payload, signature);

    // Update order payment status when payment succeeds or fails
    if (event?.type === 'payment_intent.succeeded') {
      const paymentIntentId = (event.data.object as any).id;
      await query(
        `UPDATE orders SET payment_status = 'paid', status = 'confirmed'
         WHERE stripe_payment_intent_id = $1`,
        [paymentIntentId]
      );
    } else if (event?.type === 'payment_intent.payment_failed') {
      const paymentIntentId = (event.data.object as any).id;
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
