import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sendEmail, shippingUpdateHtml } from '@/lib/email';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const isAdmin = session.role === 'admin' || session.role === 'super_admin';
    const order = await queryOne(`
      SELECT o.*,
        u.name AS customer_name, u.email AS customer_email,
        COALESCE(json_agg(oi.* ORDER BY oi.created_at) FILTER (WHERE oi.id IS NOT NULL), '[]') AS items
      FROM orders o
      JOIN users u ON u.id = o.user_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.id = $1 ${isAdmin ? '' : 'AND o.user_id = $2'}
      GROUP BY o.id, u.name, u.email
    `, isAdmin ? [params.id] : [params.id, session.id]);

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const isAdmin = session.role === 'admin' || session.role === 'super_admin';
    const isVendor = session.role === 'vendor';
    if (!isAdmin && !isVendor) {
      return NextResponse.json({ success: false, error: 'Admin or vendor access required' }, { status: 403 });
    }

    const body = await req.json();
    const ALLOWED: Record<string, string[]> = {
      admin: ['status', 'payment_status', 'tracking_number', 'notes'],
      vendor: ['status'],
    };
    const allowedFields = isAdmin ? ALLOWED.admin : ALLOWED.vendor;

    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = $${idx}`);
        values.push(body[field]);
        idx++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid fields to update' }, { status: 400 });
    }

    updates.push(`updated_at = NOW()`);
    values.push(params.id);

    const order = await queryOne(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Send shipping/status update email for relevant status changes
    const notifyStatuses = ['shipped', 'delivered', 'confirmed', 'processing'];
    if (body.status && notifyStatuses.includes(body.status)) {
      const customer = await queryOne(
        'SELECT name, email FROM users WHERE id = $1',
        [order.user_id]
      );
      if (customer?.email) {
        sendEmail({
          to: customer.email,
          subject: `Order Update — #${order.order_number}`,
          html: shippingUpdateHtml({
            orderNumber: order.order_number,
            customerName: customer.name,
            trackingNumber: order.tracking_number,
            status: body.status,
          }),
        }).catch(() => {});
      }
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
