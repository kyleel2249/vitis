import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const offset = (page - 1) * limit;
    const q = searchParams.get('q') || '';

    const conditions: string[] = ["v.status = 'active'"];
    const params: any[] = [];
    let idx = 1;

    if (q) {
      conditions.push(`(v.store_name ILIKE $${idx} OR v.description ILIKE $${idx})`);
      params.push(`%${q}%`);
      idx++;
    }

    const WHERE = `WHERE ${conditions.join(' AND ')}`;

    const vendors = await query(`
      SELECT 
        v.id, v.store_name, v.slug, v.description, v.is_verified, v.status,
        v.rating, v.commission_rate, v.created_at,
        COUNT(DISTINCT p.id)::int AS product_count
      FROM vendors v
      LEFT JOIN products p ON p.vendor_id = v.id AND p.is_active = true
      ${WHERE}
      GROUP BY v.id
      ORDER BY v.is_verified DESC, v.rating DESC, v.created_at DESC
      LIMIT $${idx} OFFSET $${idx + 1}
    `, [...params, limit, offset]);

    const [{ count }] = await query(`
      SELECT COUNT(*)::int AS count FROM vendors v ${WHERE}
    `, params) as any[];

    return NextResponse.json({
      success: true,
      data: vendors,
      pagination: { page, limit, total: count, pages: Math.ceil(count / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
