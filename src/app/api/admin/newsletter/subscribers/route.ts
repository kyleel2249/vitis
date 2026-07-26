import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAdminUser } from '@/lib/admin';

export async function GET(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });

  const search = request.nextUrl.searchParams.get('search')?.trim() || '';
  const status = request.nextUrl.searchParams.get('status') || 'all';
  const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get('limit')) || 100, 1), 500);

  const filters = ['1=1'];
  const params: (string | number | boolean)[] = [];
  if (search) {
    params.push(`%${search}%`);
    filters.push(`email ILIKE $${params.length}`);
  }
  if (status === 'active' || status === 'inactive') {
    params.push(status === 'active');
    filters.push(`is_active = $${params.length}`);
  }
  params.push(limit);

  const [stats, subscribers] = await Promise.all([
    query<{ total: string; active: string; inactive: string }>(
      `SELECT COUNT(*)::text AS total,
              COUNT(*) FILTER (WHERE is_active)::text AS active,
              COUNT(*) FILTER (WHERE NOT is_active)::text AS inactive
       FROM newsletter_subscribers`
    ),
    query(
      `SELECT id, email, is_active, source, subscribed_at, unsubscribed_at
       FROM newsletter_subscribers
       WHERE ${filters.join(' AND ')}
       ORDER BY subscribed_at DESC
       LIMIT $${params.length}`,
      params
    ),
  ]);

  return NextResponse.json({
    success: true,
    stats: stats[0] || { total: '0', active: '0', inactive: '0' },
    subscribers,
  });
}