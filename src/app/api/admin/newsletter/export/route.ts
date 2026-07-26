import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminUser } from '@/lib/admin';

function csvCell(value: unknown) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });

  const subscribers = await query<{ email: string; subscribed_at: string }>(
    `SELECT email, subscribed_at
     FROM newsletter_subscribers
     WHERE is_active = true
     ORDER BY subscribed_at DESC`
  );
  const csv = [
    'email,subscribed_at',
    ...subscribers.map((subscriber) => `${csvCell(subscriber.email)},${csvCell(subscriber.subscribed_at)}`),
  ].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="vitis-newsletter-subscribers.csv"',
    },
  });
}