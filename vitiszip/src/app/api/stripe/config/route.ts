import { NextResponse } from 'next/server';
import { getStripePublishableKey } from '@/lib/stripeClient';

export async function GET() {
  try {
    const publishableKey = await getStripePublishableKey();
    return NextResponse.json({ publishableKey });
  } catch (error: any) {
    console.error('Stripe config error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
