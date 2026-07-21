import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    const products = await query(`
      SELECT p.id, p.name, p.slug, p.price, p.images, p.sku,
        c.name as category_name,
        COALESCE(AVG(r.rating), 0)::numeric(3,1) as rating
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN reviews r ON r.product_id = p.id
      WHERE p.is_active = true AND (
        p.name ILIKE $1 OR 
        p.description ILIKE $1 OR 
        p.sku ILIKE $1 OR
        c.name ILIKE $1
      )
      GROUP BY p.id, c.name
      ORDER BY p.is_featured DESC, p.name ASC
      LIMIT $2
    `, [`%${q}%`, limit]);

    const normalized = products.map((p) => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : (p.images || []),
    }));

    return NextResponse.json({ success: true, data: normalized, query: q });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
