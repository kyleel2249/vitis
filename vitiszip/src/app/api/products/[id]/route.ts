import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await queryOne(`
      SELECT p.*, 
        c.name as category_name, c.slug as category_slug,
        v.store_name as vendor_name,
        COALESCE(AVG(r.rating), 0)::numeric(3,1) as rating,
        COUNT(DISTINCT r.id)::int as review_count
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      LEFT JOIN vendors v ON v.id = p.vendor_id
      LEFT JOIN reviews r ON r.product_id = p.id
      WHERE p.id = $1 AND p.is_active = true
      GROUP BY p.id, c.name, c.slug, v.store_name
    `, [params.id]);

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const normalized = {
      ...product,
      images: typeof product.images === 'string' ? JSON.parse(product.images || '[]') : (product.images || []),
      tags: typeof product.tags === 'string' ? JSON.parse(product.tags || '[]') : (product.tags || []),
    };

    return NextResponse.json({ success: true, data: normalized });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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
    if (isVendor) {
      let vendorId = session.vendorId || null;
      if (!vendorId) {
        const vendor = await queryOne('SELECT id FROM vendors WHERE user_id = $1', [session.id]);
        vendorId = vendor?.id || null;
      }
      if (!vendorId) {
        return NextResponse.json({ success: false, error: 'Vendor account not found' }, { status: 403 });
      }
      const product = await queryOne(
        'SELECT id FROM products WHERE id = $1 AND vendor_id = $2',
        [params.id, vendorId]
      );
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found or access denied' }, { status: 403 });
      }
    }
    // Soft-delete: deactivate rather than hard-delete so order history remains intact
    await queryOne('UPDATE products SET is_active = false, updated_at = NOW() WHERE id = $1', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Require authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const isAdmin = session.role === 'admin' || session.role === 'super_admin';
    const isVendor = session.role === 'vendor';

    if (!isVendor && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Vendor or admin access required' }, { status: 403 });
    }

    // For vendors, verify ownership before allowing any update
    if (isVendor) {
      let vendorId = session.vendorId || null;
      if (!vendorId) {
        const vendor = await queryOne('SELECT id FROM vendors WHERE user_id = $1', [session.id]);
        vendorId = vendor?.id || null;
      }
      if (!vendorId) {
        return NextResponse.json({ success: false, error: 'Vendor account not found' }, { status: 403 });
      }

      const product = await queryOne(
        'SELECT id FROM products WHERE id = $1 AND vendor_id = $2',
        [params.id, vendorId]
      );
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found or access denied' }, { status: 403 });
      }
    }

    const body = await req.json();
    // Allowed update fields — vendor_id is intentionally excluded (immutable after creation)
    const ALLOWED_FIELDS = ['name', 'description', 'short_description', 'price', 'compare_price',
      'stock_quantity', 'is_active', 'is_featured', 'images', 'tags', 'weight', 'category_id'];

    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const field of ALLOWED_FIELDS) {
      if (body[field] !== undefined) {
        if (field === 'images' || field === 'tags') {
          updates.push(`${field} = $${idx}::jsonb`);
          values.push(JSON.stringify(Array.isArray(body[field]) ? body[field] : []));
        } else {
          updates.push(`${field} = $${idx}`);
          values.push(body[field]);
        }
        idx++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid fields to update' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(params.id);

    const product = await queryOne(
      `UPDATE products SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
