import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

/** POST /api/wishlist/toggle — add or remove a product from the wishlist */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ success: false, error: 'Missing productId' }, { status: 400 });

  const existing = await queryOne(
    'SELECT id FROM wishlists WHERE user_id = $1 AND product_id = $2',
    [session.id, productId]
  );

  if (existing) {
    await query('DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2', [session.id, productId]);
    return NextResponse.json({ success: true, action: 'removed' });
  } else {
    await query(
      'INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [session.id, productId]
    );
    return NextResponse.json({ success: true, action: 'added' });
  }
}
