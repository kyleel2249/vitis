import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { signToken, UserPayload } from '@/lib/auth';
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { idToken, name } = await req.json();

    if (!idToken || !name) {
      return NextResponse.json({ success: false, error: 'ID token and name are required' }, { status: 400 });
    }

    // Verify the Firebase ID token
    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 });
    }

    const { uid, email } = decoded;
    if (!email) {
      return NextResponse.json({ success: false, error: 'No email in token' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check for an existing account
    const existing = await queryOne(
      'SELECT id FROM users WHERE firebase_uid = $1 OR email = $2',
      [uid, normalizedEmail]
    );
    if (existing) {
      return NextResponse.json({ success: false, error: 'An account with this email already exists' }, { status: 409 });
    }

    const id = uuidv4();
    await query(
      `INSERT INTO users (id, firebase_uid, email, name, password_hash, role, is_active, created_at)
       VALUES ($1, $2, $3, $4, '', 'customer', true, NOW())`,
      [id, uid, normalizedEmail, name.trim()]
    );

    const payload: UserPayload = { id, email: normalizedEmail, name: name.trim(), role: 'customer' };
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

    return NextResponse.json({
      success: true,
      user: { id, email: normalizedEmail, name: name.trim(), role: 'customer' },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
  }
}
