import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const rows = await query(
    `SELECT product_id AS "productId", name, price::float, original_price::float AS "originalPrice",
            image, quantity, variant, vendor_id AS "vendorId", vendor_name AS "vendorName"
     FROM cart_items WHERE user_id = $1 ORDER BY created_at ASC`,
    [session.id]
  );

  return NextResponse.json({ success: true, items: rows });
}

/**
 * POST /api/cart/sync
 * Body: { items: CartItem[] }
 * Upserts all local items into the server cart, then returns the full merged cart.
 * Items that exist only on the server (added from another device) are preserved.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { items = [] } = await req.json();

  // Upsert each local item into the server cart
  for (const item of items) {
    const variant = item.variant || '';
    await query(
      `INSERT INTO cart_items
         (user_id, product_id, name, price, original_price, image, quantity, variant, vendor_id, vendor_name, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())
       ON CONFLICT (user_id, product_id, variant)
       DO UPDATE SET quantity = EXCLUDED.quantity,
                     price = EXCLUDED.price,
                     name = EXCLUDED.name,
                     image = EXCLUDED.image,
                     updated_at = NOW()`,
      [
        session.id,
        item.productId,
        item.name,
        item.price,
        item.originalPrice ?? null,
        item.image ?? null,
        item.quantity || 1,
        variant,
        item.vendorId ?? null,
        item.vendorName ?? null,
      ]
    );
  }

  // Return the full merged cart (local items + any server-only items from other devices)
  const merged = await query(
    `SELECT product_id AS "productId", name, price::float, original_price::float AS "originalPrice",
            image, quantity, variant, vendor_id AS "vendorId", vendor_name AS "vendorName"
     FROM cart_items WHERE user_id = $1 ORDER BY created_at ASC`,
    [session.id]
  );

  return NextResponse.json({ success: true, items: merged });
}
