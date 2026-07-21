import { NextRequest, NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db';
import { signToken, UserPayload } from '@/lib/auth';
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ success: false, error: 'Firebase ID token is required' }, { status: 400 });
    }

    // Verify the Firebase ID token
    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 });
    }

    const { uid, email, name: firebaseName } = decoded;
    if (!email) {
      return NextResponse.json({ success: false, error: 'No email in token' }, { status: 400 });
    }

    // Find or create the user record in PostgreSQL
    let user = await queryOne(
      'SELECT * FROM users WHERE firebase_uid = $1 OR email = $2',
      [uid, email.toLowerCase()]
    );

    if (!user) {
      const id = uuidv4();
      await query(
        `INSERT INTO users (id, firebase_uid, email, name, password_hash, role, is_active, created_at)
         VALUES ($1, $2, $3, $4, '', 'customer', true, NOW())`,
        [id, uid, email.toLowerCase(), firebaseName || email.split('@')[0]]
      );
      user = await queryOne('SELECT * FROM users WHERE id = $1', [id]);
    } else if (!user.firebase_uid) {
      // Link existing email-based record to the Firebase UID
      await query('UPDATE users SET firebase_uid = $1 WHERE id = $2', [uid, user.id]);
    }

    if (!user.is_active) {
      return NextResponse.json({ success: false, error: 'Account is disabled' }, { status: 403 });
    }

    const payload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    if (user.role === 'vendor') {
      const vendor = await queryOne('SELECT id FROM vendors WHERE user_id = $1', [user.id]);
      if (vendor) payload.vendorId = vendor.id;
    }

    const token = await signToken(payload);

    // Persistent httpOnly cookie — stays on the device for 30 days
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
