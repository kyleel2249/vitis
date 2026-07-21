import { NextResponse } from 'next/server';
import { getSession, getCurrentUser } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    // Include vendorId for vendor users (from JWT or DB lookup)
    let vendorId = session.vendorId || null;
    if (!vendorId && user.role === 'vendor') {
      const vendor = await queryOne('SELECT id FROM vendors WHERE user_id = $1', [user.id]);
      vendorId = vendor?.id || null;
    }

    return NextResponse.json({
      success: true,
      user: { ...user, vendorId },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to get user' }, { status: 500 });
  }
}
