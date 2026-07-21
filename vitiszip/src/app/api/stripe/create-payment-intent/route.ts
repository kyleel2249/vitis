import { NextRequest, NextResponse } from 'next/server';
import { getUncachableStripeClient } from '@/lib/stripeClient';
import { getSession } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'usd', metadata = {} } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const stripe = await getUncachableStripeClient();
    const session = await getSession();

    // Find or create a Stripe customer for logged-in users
    let customerId: string | undefined;
    if (session?.id) {
      const user = await queryOne(
        'SELECT stripe_customer_id, email, name FROM users WHERE id = $1',
        [session.id]
      );
      if (user?.stripe_customer_id) {
        customerId = user.stripe_customer_id;
      } else if (user) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: { userId: session.id },
        });
        customerId = customer.id;
        await queryOne(
          'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
          [customer.id, session.id]
        );
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert dollars to cents
      currency,
      customer: customerId,
      automatic_payment_methods: { enabled: true },
      metadata,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error: any) {
    console.error('Payment intent error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
