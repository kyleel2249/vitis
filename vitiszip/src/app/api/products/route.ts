import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '16'));
    const offset = (page - 1) * limit;
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'newest';
    const featured = searchParams.get('featured') === 'true';
    const minPrice = parseFloat(searchParams.get('min_price') || '0');
    const maxPrice = parseFloat(searchParams.get('max_price') || '999999');
    const vendorId = searchParams.get('vendor_id') || '';

    const conditions: string[] = ['p.is_active = true'];
    const params: any[] = [];
    let paramIdx = 1;

    if (q) {
      conditions.push(`(p.name ILIKE $${paramIdx} OR p.description ILIKE $${paramIdx} OR p.sku ILIKE $${paramIdx})`);
      params.push(`%${q}%`);
      paramIdx++;
    }
    if (category) {
      conditions.push(`c.slug = $${paramIdx}`);
      params.push(category);
      paramIdx++;
    }
    if (featured) {
      conditions.push(`p.is_featured = true`);
    }
    if (minPrice > 0) {
      conditions.push(`p.price >= $${paramIdx}`);
      params.push(minPrice);
      paramIdx++;
    }
    if (maxPrice < 999999) {
      conditions.push(`p.price <= $${paramIdx}`);
      params.push(maxPrice);
      paramIdx++;
    }
    if (vendorId) {
      conditions.push(`p.vendor_id = $${paramIdx}`);
      params.push(vendorId);
      paramIdx++;
    }

    const WHERE = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const ORDER_MAP: Record<string, string> = {
      newest: 'p.created_at DESC',
      oldest: 'p.created_at ASC',
      price_asc: 'p.price ASC',
      price_desc: 'p.price DESC',
      rating: 'avg_rating DESC NULLS LAST',
      best_sellers: 'p.sold_count DESC NULLS LAST',
      discount: '(p.compare_price - p.price) DESC NULLS LAST',
    };
    const ORDER = ORDER_MAP[sort] || ORDER_MAP.newest;

    const dataQuery = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        v.store_name as vendor_name,
        COALESCE(AVG(r.rating), 0)::numeric(3,1) as rating,
        COUNT(DISTINCT r.id)::int as review_count
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN vendors v ON v.id = p.vendor_id
      LEFT JOIN reviews r ON r.product_id = p.id
      ${WHERE}
      GROUP BY p.id, c.name, c.slug, v.store_name
      ORDER BY ${ORDER}
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT p.id)::int as total
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN vendors v ON v.id = p.vendor_id
      ${WHERE}
    `;

    const [products, countResult] = await Promise.all([
      query(dataQuery, [...params, limit, offset]),
      query(countQuery, params),
    ]);

    const normalized = products.map((p) => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : (p.images || []),
      tags: typeof p.tags === 'string' ? JSON.parse(p.tags || '[]') : (p.tags || []),
    }));

    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: normalized,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Products API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Require authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    // Only vendors and admins can create products
    const isAdmin = session.role === 'admin' || session.role === 'super_admin';
    const isVendor = session.role === 'vendor';
    if (!isVendor && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Vendor or admin access required' }, { status: 403 });
    }

    // Derive vendor_id from session — never trust client-supplied vendor_id
    let vendorId: string | null = null;
    if (isVendor) {
      // Get vendor ID from JWT or DB
      vendorId = session.vendorId || null;
      if (!vendorId) {
        const vendor = await queryOne('SELECT id FROM vendors WHERE user_id = $1', [session.id]);
        if (!vendor) {
          return NextResponse.json({ success: false, error: 'Vendor account not found' }, { status: 403 });
        }
        vendorId = vendor.id;
      }
    }
    const body = await req.json();
    const { name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, images, tags, is_featured, is_digital, weight } = body;

    // Admins may supply a vendor_id in the body; vendors always use their own
    if (isAdmin) {
      vendorId = body.vendor_id || null;
    }

    if (!name || !slug || !price || !sku) {
      return NextResponse.json({ success: false, error: 'name, slug, price, and sku are required' }, { status: 400 });
    }

    const result = await query(`
      INSERT INTO products (name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, vendor_id, images, tags, is_featured, is_digital, weight, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12::jsonb, $13, $14, $15, true)
      RETURNING *
    `, [name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, vendorId,
        JSON.stringify(images || []), JSON.stringify(tags || []), is_featured || false, is_digital || false, weight || null]);

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
