import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { hashPassword, signToken, UserPayload } from '@/lib/auth';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: 'Name, email and password are required' }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ success: false, error: 'Enter a valid email address' }, { status: 400 });
    }
    if (String(password).length < 8) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const existing = await queryOne('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing) {
      return NextResponse.json({ success: false, error: 'An account with this email already exists' }, { status: 409 });
    }

    const id = uuidv4();
    const cleanName = String(name).trim();
    await query(
      `INSERT INTO users (id, email, name, password_hash, role, is_active, created_at)
       VALUES ($1, $2, $3, $4, 'customer', true, NOW())`,
      [id, normalizedEmail, cleanName, await hashPassword(String(password))]
    );

    const payload: UserPayload = { id, email: normalizedEmail, name: cleanName, role: 'customer' };
    const token = await signToken(payload);
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return NextResponse.json({ success: true, user: payload }, { status: 201 });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
  }
}
