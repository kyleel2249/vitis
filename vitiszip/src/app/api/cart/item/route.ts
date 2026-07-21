import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

/** POST /api/cart/item — upsert a single item (add or update quantity) */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const item = await req.json();
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

  return NextResponse.json({ success: true });
}

/** DELETE /api/cart/item?productId=X&variant=Y — remove a single item */
export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  const variant = searchParams.get('variant') ?? '';

  if (!productId) return NextResponse.json({ success: false, error: 'Missing productId' }, { status: 400 });

  await query(
    'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 AND variant = $3',
    [session.id, productId, variant]
  );

  return NextResponse.json({ success: true });
}
