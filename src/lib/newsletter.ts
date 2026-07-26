import { createHmac, timingSafeEqual } from 'node:crypto';

function getSigningSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET environment variable is required');
  return secret;
}

export function createUnsubscribeToken(email: string) {
  return createHmac('sha256', getSigningSecret()).update(email).digest('hex');
}

export function isValidUnsubscribeToken(email: string, token: string) {
  try {
    const expected = Buffer.from(createUnsubscribeToken(email), 'hex');
    const received = Buffer.from(token, 'hex');
    return received.length === expected.length && timingSafeEqual(received, expected);
  } catch {
    return false;
  }
}

export function getRequestOrigin(request: Request) {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost || request.headers.get('host') || 'localhost:5000';
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0].trim();
  const protocol = forwardedProto || (host.startsWith('localhost') ? 'http' : 'https');
  return `${protocol}://${host}`;
}