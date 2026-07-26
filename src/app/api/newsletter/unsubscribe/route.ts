import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getRequestOrigin, isValidUnsubscribeToken } from '@/lib/newsletter';

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')?.toLowerCase().trim() || '';
  const token = request.nextUrl.searchParams.get('token') || '';
  const origin = getRequestOrigin(request);

  if (!email || !token || !isValidUnsubscribeToken(email, token)) {
    return NextResponse.redirect(`${origin}/newsletter/unsubscribed?error=invalid`);
  }

  await query(
    `UPDATE newsletter_subscribers
     SET is_active = false, unsubscribed_at = NOW(), updated_at = NOW()
     WHERE email = $1`,
    [email]
  );

  return NextResponse.redirect(`${origin}/newsletter/unsubscribed`);
}