import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    let vendorId = session.vendorId;
    if (!vendorId) {
      const vendor = await queryOne('SELECT id FROM vendors WHERE user_id = $1', [session.id]);
      if (!vendor) {
        return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
      }
      vendorId = vendor.id;
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const offset = (page - 1) * limit;

    // "vendor_total" = sum of this vendor's line items in each order.
    // This is what the vendor actually earns — not the whole-cart total which
    // may include other vendors' items.
    const orders = await query(`
      SELECT
        o.id,
        o.order_number,
        o.status,
        o.payment_status,
        o.created_at,
        u.name  AS customer_name,
        u.email AS customer_email,
        vt.vendor_total,
        COALESCE(
          json_agg(
            json_build_object(
              'id',            oi.id,
              'product_name',  oi.product_name,
              'product_image', oi.product_image,
              'quantity',      oi.quantity,
              'unit_price',    oi.unit_price,
              'total_price',   oi.total_price
            )
            ORDER BY oi.product_name
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'
        ) AS items
      FROM orders o
      JOIN users u ON u.id = o.user_id
      -- Only the vendor's line items
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products    p  ON p.id = oi.product_id AND p.vendor_id = $1
      -- Pre-aggregate vendor subtotal per order to avoid join inflation
      JOIN (
        SELECT
          oi2.order_id,
          SUM(oi2.total_price)::numeric(12,2) AS vendor_total
        FROM order_items oi2
        JOIN products p2 ON p2.id = oi2.product_id AND p2.vendor_id = $1
        GROUP BY oi2.order_id
      ) vt ON vt.order_id = o.id
      GROUP BY o.id, u.name, u.email, vt.vendor_total
      ORDER BY o.created_at DESC
      LIMIT $2 OFFSET $3
    `, [vendorId, limit, offset]);

    const countRow = await queryOne(`
      SELECT COUNT(DISTINCT o.id)::int AS total
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products    p  ON p.id = oi.product_id
      WHERE p.vendor_id = $1
    `, [vendorId]);

    return NextResponse.json({
      success: true,
      data: orders,
      total: countRow?.total || 0,
      page,
      limit,
    });
  } catch (error: any) {
    console.error('Vendor orders error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
