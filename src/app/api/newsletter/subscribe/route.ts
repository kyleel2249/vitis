import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === 'string' ? body.email.toLowerCase().trim() : '';

    if (!email || !isValidEmail(email) || email.length > 320) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const inserted = await queryOne<{ id: string }>(
      `INSERT INTO newsletter_subscribers (email, source)
       VALUES ($1, 'footer')
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [email]
    );

    if (inserted) {
      return NextResponse.json({
        success: true,
        message: 'You’re subscribed. Watch your inbox for the latest from Vitis.',
      }, { status: 201 });
    }

    const existing = await queryOne<{ is_active: boolean }>(
      'SELECT is_active FROM newsletter_subscribers WHERE email = $1',
      [email]
    );

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'We could not complete your subscription. Please try again.' },
        { status: 500 }
      );
    }

    if (!existing.is_active) {
      await query(
        `UPDATE newsletter_subscribers
         SET is_active = true, subscribed_at = NOW(), unsubscribed_at = NULL, updated_at = NOW()
         WHERE email = $1`,
        [email]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'This email is already subscribed to Vitis updates.',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'We could not complete your subscription. Please try again.' },
      { status: 500 }
    );
  }
}