import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { getAdminUser } from '@/lib/admin';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  if (typeof body?.isActive !== 'boolean') {
    return NextResponse.json({ success: false, error: 'isActive must be a boolean' }, { status: 400 });
  }

  const subscriber = await queryOne(
    `UPDATE newsletter_subscribers
     SET is_active = $1,
         unsubscribed_at = CASE WHEN $1 THEN NULL ELSE COALESCE(unsubscribed_at, NOW()) END,
         subscribed_at = CASE WHEN $1 AND unsubscribed_at IS NOT NULL THEN NOW() ELSE subscribed_at END,
         updated_at = NOW()
     WHERE id = $2
     RETURNING id, email, is_active, source, subscribed_at, unsubscribed_at`,
    [body.isActive, id]
  );

  if (!subscriber) return NextResponse.json({ success: false, error: 'Subscriber not found' }, { status: 404 });
  return NextResponse.json({ success: true, subscriber });
}