import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { queryOne } from './db';

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET environment variable is required but not set. Set it before starting the server.');
}
const JWT_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET);

export type UserPayload = {
  id: string;
  email: string;
  name: string;
  role: string;
  vendorId?: string;
};

export async function signToken(payload: UserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return queryOne(
    'SELECT id, email, name, role, avatar_url, created_at FROM users WHERE id = $1 AND is_active = true',
    [session.id]
  );
}
