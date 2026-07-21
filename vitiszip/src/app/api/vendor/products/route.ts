import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getSession } from '@/lib/auth';

/**
 * GET /api/vendor/products
 * Returns ALL products (active AND inactive) for the authenticated vendor.
 * This is the vendor-management view — distinct from the public /api/products
 * which only returns active products.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const isAdmin = session.role === 'admin' || session.role === 'super_admin';
    const isVendor = session.role === 'vendor';

    if (!isVendor && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Vendor or admin access required' }, { status: 403 });
    }

    // Resolve vendor ID from session
    let vendorId = session.vendorId || null;
    if (!vendorId) {
      const vendor = await queryOne('SELECT id FROM vendors WHERE user_id = $1', [session.id]);
      if (!vendor) {
        return NextResponse.json({ success: false, error: 'Vendor account not found' }, { status: 403 });
      }
      vendorId = vendor.id;
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '100'));
    const offset = (page - 1) * limit;
    const q = searchParams.get('q') || '';

    const conditions: string[] = ['p.vendor_id = $1'];
    const params: any[] = [vendorId];
    let paramIdx = 2;

    if (q) {
      conditions.push(`(p.name ILIKE $${paramIdx} OR p.sku ILIKE $${paramIdx})`);
      params.push(`%${q}%`);
      paramIdx++;
    }

    const WHERE = `WHERE ${conditions.join(' AND ')}`;

    const products = await query(`
      SELECT
        p.*,
        c.name  AS category_name,
        c.slug  AS category_slug,
        COALESCE(AVG(r.rating), 0)::numeric(3,1) AS rating,
        COUNT(DISTINCT r.id)::int                AS review_count
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN reviews r    ON r.product_id = p.id
      ${WHERE}
      GROUP BY p.id, c.name, c.slug
      ORDER BY p.created_at DESC
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
    `, [...params, limit, offset]);

    const countRow = await queryOne(
      `SELECT COUNT(*)::int AS total FROM products p ${WHERE}`,
      params
    );

    const normalized = products.map((p) => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : (p.images || []),
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : (p.tags || []),
    }));

    return NextResponse.json({
      success: true,
      data: normalized,
      total: countRow?.total || 0,
      page,
      limit,
    });
  } catch (error: any) {
    console.error('Vendor products error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
