import { NextRequest, NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db';
import { comparePassword, signToken, UserPayload } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const user = await queryOne<any>(
      'SELECT id, email, name, role, is_active, password_hash FROM users WHERE email = $1',
      [String(email).toLowerCase().trim()]
    );

    if (!user || !user.is_active || !user.password_hash || !(await comparePassword(password, user.password_hash))) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const payload: UserPayload = { id: user.id, email: user.email, name: user.name, role: user.role };
    if (user.role === 'vendor') {
      const vendor = await queryOne<{ id: string }>('SELECT id FROM vendors WHERE user_id = $1', [user.id]);
      if (vendor) payload.vendorId = vendor.id;
    }

    const token = await signToken(payload);
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}
