import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

/** GET /api/wishlist — return array of product_ids for the logged-in user */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const rows = await query<{ product_id: string }>(
    'SELECT product_id FROM wishlists WHERE user_id = $1 ORDER BY created_at ASC',
    [session.id]
  );

  return NextResponse.json({ success: true, productIds: rows.map((r) => r.product_id) });
}

/**
 * POST /api/wishlist/sync
 * Body: { productIds: string[] }
 * Upserts all local wishlist IDs, returns the full merged wishlist.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { productIds = [] } = await req.json();

  // Upsert each local item
  for (const productId of productIds) {
    await query(
      `INSERT INTO wishlists (user_id, product_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING`,
      [session.id, productId]
    );
  }

  // Return full merged wishlist
  const rows = await query<{ product_id: string }>(
    'SELECT product_id FROM wishlists WHERE user_id = $1 ORDER BY created_at ASC',
    [session.id]
  );

  return NextResponse.json({ success: true, productIds: rows.map((r) => r.product_id) });
}
