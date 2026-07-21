import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail, orderConfirmationHtml } from '@/lib/email';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const isAdmin = session.role === 'admin' || session.role === 'super_admin';

    const orders = isAdmin
      ? await query(`
          SELECT o.*,
            u.name as customer_name,
            u.email as customer_email,
            COALESCE(json_agg(oi.*) FILTER (WHERE oi.id IS NOT NULL), '[]') as items
          FROM orders o
          JOIN users u ON u.id = o.user_id
          LEFT JOIN order_items oi ON oi.order_id = o.id
          GROUP BY o.id, u.name, u.email
          ORDER BY o.created_at DESC
          LIMIT $1 OFFSET $2
        `, [limit, offset])
      : await query(`
          SELECT o.*,
            u.name as customer_name,
            u.email as customer_email,
            COALESCE(json_agg(oi.*) FILTER (WHERE oi.id IS NOT NULL), '[]') as items
          FROM orders o
          JOIN users u ON u.id = o.user_id
          LEFT JOIN order_items oi ON oi.order_id = o.id
          WHERE o.user_id = $3
          GROUP BY o.id, u.name, u.email
          ORDER BY o.created_at DESC
          LIMIT $1 OFFSET $2
        `, [limit, offset, session.id]);

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shipping_address, shipping_method, subtotal, shipping_cost, tax, total, order_number, stripe_payment_intent_id, payment_status: paymentStatus } = body;

    const session = await getSession();
    // Allow guest checkout
    const userId = session?.id;

    const orderId = uuidv4();
    const guestUserId = userId || 'guest-' + Date.now();

    await transaction(async (client) => {
      // Create guest user if needed
      let finalUserId = userId;
      if (!userId) {
        const guestId = uuidv4();
        await client.query(
          `INSERT INTO users (id, email, name, password_hash, role, is_active, created_at) 
           VALUES ($1, $2, $3, '', 'customer', false, NOW()) 
           ON CONFLICT (email) DO NOTHING`,
          [guestId, `guest-${Date.now()}@checkout.local`, shipping_address?.first_name || 'Guest']
        );
        finalUserId = guestId;
      }

      // Create order
      const resolvedPaymentStatus = paymentStatus || 'pending';
      const resolvedStatus = resolvedPaymentStatus === 'paid' ? 'confirmed' : 'pending';
      await client.query(`
        INSERT INTO orders (id, order_number, user_id, status, payment_status, subtotal, shipping_cost, tax, total, currency, shipping_address, stripe_payment_intent_id, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'USD', $10::jsonb, $11, NOW())
      `, [orderId, order_number, finalUserId, resolvedStatus, resolvedPaymentStatus, subtotal, shipping_cost, tax, total, JSON.stringify(shipping_address), stripe_payment_intent_id || null]);

      // Create order items
      for (const item of (items || [])) {
        await client.query(`
          INSERT INTO order_items (id, order_id, product_id, product_name, product_image, quantity, unit_price, total_price)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [uuidv4(), orderId, item.productId, item.name, item.image, item.quantity, item.price, item.price * item.quantity]);

        // Update stock
        await client.query(
          'UPDATE products SET stock_quantity = GREATEST(0, stock_quantity - $1), sold_count = COALESCE(sold_count, 0) + $1 WHERE id = $2',
          [item.quantity, item.productId]
        );
      }
    });

    // Send confirmation email (best-effort, non-blocking)
    const customerEmail = shipping_address?.email;
    const customerName = `${shipping_address?.first_name || ''} ${shipping_address?.last_name || ''}`.trim() || 'Customer';
    if (customerEmail) {
      sendEmail({
        to: customerEmail,
        subject: `Order Confirmed — #${order_number}`,
        html: orderConfirmationHtml({
          orderNumber: order_number,
          customerName,
          items: (items || []).map((i: any) => ({ name: i.name, quantity: i.quantity, price: i.price })),
          subtotal: subtotal ?? 0,
          shippingCost: shipping_cost ?? 0,
          tax: tax ?? 0,
          total: total ?? 0,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, data: { id: orderId, order_number } }, { status: 201 });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
