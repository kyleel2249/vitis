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

    const [statsRow, earningsByWeek, topProducts, recentOrders, vendorInfo] = await Promise.all([

      // ── Aggregate stats ─────────────────────────────────────────────────────
      // Earnings and order counts are derived only from this vendor's line items.
      queryOne(`
        SELECT
          COALESCE(SUM(oi.total_price), 0)::numeric(12,2)    AS total_earnings,
          COUNT(DISTINCT o.id)::int                           AS total_orders,
          (SELECT COUNT(*)::int FROM products
           WHERE vendor_id = $1 AND is_active = true)         AS product_count,
          COALESCE(
            (SELECT AVG(r.rating)::numeric(3,1)
             FROM reviews r
             JOIN products p ON p.id = r.product_id
             WHERE p.vendor_id = $1), 0)::numeric(3,1)        AS avg_rating
        FROM order_items oi
        JOIN orders  o ON o.id = oi.order_id
        JOIN products p ON p.id = oi.product_id
        WHERE p.vendor_id = $1
      `, [vendorId]),

      // ── Earnings by week (last 8 weeks) ─────────────────────────────────────
      // Amount = vendor line-item total per week, not whole-order total.
      query(`
        SELECT
          TO_CHAR(DATE_TRUNC('week', o.created_at), 'Mon DD') AS week,
          COALESCE(SUM(oi.total_price), 0)::numeric(12,2)     AS earnings,
          COUNT(DISTINCT o.id)::int                           AS orders
        FROM order_items oi
        JOIN orders  o ON o.id = oi.order_id
        JOIN products p ON p.id = oi.product_id
        WHERE p.vendor_id = $1
          AND o.created_at >= NOW() - INTERVAL '8 weeks'
        GROUP BY DATE_TRUNC('week', o.created_at)
        ORDER BY DATE_TRUNC('week', o.created_at)
      `, [vendorId]),

      // ── Top products by vendor revenue ───────────────────────────────────────
      // Use separate CTEs for sales and ratings to prevent join row-multiplication.
      query(`
        WITH sales AS (
          SELECT
            oi.product_id,
            COALESCE(SUM(oi.quantity), 0)::int         AS sold,
            COALESCE(SUM(oi.total_price), 0)::numeric(12,2) AS revenue
          FROM order_items oi
          JOIN orders o ON o.id = oi.order_id
          JOIN products p ON p.id = oi.product_id
          WHERE p.vendor_id = $1
          GROUP BY oi.product_id
        ),
        ratings AS (
          SELECT
            r.product_id,
            COALESCE(AVG(r.rating), 0)::numeric(3,1) AS rating
          FROM reviews r
          JOIN products p ON p.id = r.product_id
          WHERE p.vendor_id = $1
          GROUP BY r.product_id
        )
        SELECT
          p.id,
          p.name,
          p.images,
          COALESCE(s.sold, 0)        AS sold,
          COALESCE(s.revenue, 0)     AS revenue,
          COALESCE(rt.rating, 0)     AS rating
        FROM products p
        LEFT JOIN sales   s  ON s.product_id  = p.id
        LEFT JOIN ratings rt ON rt.product_id = p.id
        WHERE p.vendor_id = $1
        ORDER BY COALESCE(s.revenue, 0) DESC
        LIMIT 5
      `, [vendorId]),

      // ── Recent orders ────────────────────────────────────────────────────────
      // Shows per-order vendor subtotal (sum of this vendor's items), not the
      // whole-cart total, so the "Amount" column reflects what the vendor earned.
      query(`
        SELECT DISTINCT ON (o.id)
          o.id,
          o.order_number,
          o.status,
          o.created_at,
          u.name AS customer_name,
          oi.product_name,
          vendor_totals.vendor_total
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        JOIN products    p  ON p.id = oi.product_id AND p.vendor_id = $1
        JOIN users       u  ON u.id = o.user_id
        JOIN (
          SELECT
            oi2.order_id,
            SUM(oi2.total_price)::numeric(12,2) AS vendor_total
          FROM order_items oi2
          JOIN products p2 ON p2.id = oi2.product_id AND p2.vendor_id = $1
          GROUP BY oi2.order_id
        ) vendor_totals ON vendor_totals.order_id = o.id
        ORDER BY o.id, o.created_at DESC
        LIMIT 10
      `, [vendorId]),

      // ── Vendor profile ───────────────────────────────────────────────────────
      queryOne(`
        SELECT v.*, u.name, u.email
        FROM vendors v
        JOIN users u ON u.id = v.user_id
        WHERE v.id = $1
      `, [vendorId]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: statsRow,
        earningsByWeek,
        topProducts: topProducts.map(p => ({
          ...p,
          images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : (p.images || []),
        })),
        recentOrders,
        vendor: vendorInfo,
      },
    });
  } catch (error: any) {
    console.error('Vendor stats error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
