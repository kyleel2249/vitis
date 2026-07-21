import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { signToken, hashPassword, UserPayload } from '@/lib/auth';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

async function setSessionCookie(payload: UserPayload) {
  const token = await signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── Path A: Email + Password ──────────────────────────────────────────
    if (body.email && body.password && body.name) {
      const { email, password, name } = body;
      const normalizedEmail = email.toLowerCase().trim();

      if (password.length < 6) {
        return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
      }

      const existing = await queryOne('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
      if (existing) {
        return NextResponse.json({ success: false, error: 'An account with this email already exists' }, { status: 409 });
      }

      const id = uuidv4();
      const password_hash = await hashPassword(password);
      await query(
        `INSERT INTO users (id, email, name, password_hash, role, is_active, created_at)
         VALUES ($1, $2, $3, $4, 'customer', true, NOW())`,
        [id, normalizedEmail, name.trim(), password_hash]
      );

      const payload: UserPayload = { id, email: normalizedEmail, name: name.trim(), role: 'customer' };
      await setSessionCookie(payload);
      return NextResponse.json({ success: true, user: { id, email: normalizedEmail, name: name.trim(), role: 'customer' } }, { status: 201 });
    }

    // ── Path B: Firebase ID token ─────────────────────────────────────────
    if (body.idToken && body.name) {
      let adminAuth: any;
      try {
        const mod = await import('@/lib/firebase-admin');
        adminAuth = mod.adminAuth;
      } catch {
        return NextResponse.json({ success: false, error: 'Firebase is not configured on this server. Please register with email and password.' }, { status: 503 });
      }

      let decoded: any;
      try {
        decoded = await adminAuth.verifyIdToken(body.idToken);
      } catch {
        return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 });
      }

      const { uid, email } = decoded;
      if (!email) return NextResponse.json({ success: false, error: 'No email in token' }, { status: 400 });
      const normalizedEmail = email.toLowerCase().trim();

      const existing = await queryOne('SELECT id FROM users WHERE firebase_uid = $1 OR email = $2', [uid, normalizedEmail]);
      if (existing) return NextResponse.json({ success: false, error: 'An account with this email already exists' }, { status: 409 });

      const id = uuidv4();
      await query(
        `INSERT INTO users (id, firebase_uid, email, name, password_hash, role, is_active, created_at)
         VALUES ($1, $2, $3, $4, '', 'customer', true, NOW())`,
        [id, uid, normalizedEmail, body.name.trim()]
      );

      const payload: UserPayload = { id, email: normalizedEmail, name: body.name.trim(), role: 'customer' };
      await setSessionCookie(payload);
      return NextResponse.json({ success: true, user: { id, email: normalizedEmail, name: body.name.trim(), role: 'customer' } }, { status: 201 });
    }

    return NextResponse.json({ success: false, error: 'name + email + password (or a Firebase idToken) are required' }, { status: 400 });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
  }
}
