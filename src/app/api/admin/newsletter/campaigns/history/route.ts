import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminUser } from '@/lib/admin';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });

  const campaigns = await query(
    `SELECT id, subject, status, recipient_count, sent_count, failed_count, created_at, completed_at
     FROM newsletter_campaigns
     ORDER BY created_at DESC
     LIMIT 20`
  );
  return NextResponse.json({ success: true, campaigns });
}