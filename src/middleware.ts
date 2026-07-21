import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const VISITOR_COOKIE = 'visitor_id';
const SESSION_COOKIE = 'session_start';
const ONE_YEAR = 365 * 24 * 60 * 60; // seconds

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Set a persistent visitor ID cookie if not present
  const existingVisitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  if (!existingVisitorId) {
    response.cookies.set(VISITOR_COOKIE, uuidv4(), {
      httpOnly: false, // readable by client-side analytics
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ONE_YEAR,
      path: '/',
    });
  }

  // Set a session-start timestamp cookie that resets each new browser session
  const existingSession = request.cookies.get(SESSION_COOKIE)?.value;
  if (!existingSession) {
    response.cookies.set(SESSION_COOKIE, new Date().toISOString(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      // No maxAge = session cookie; cleared when browser closes
      path: '/',
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml
     * - api/ routes (auth cookies are set per-request inside each API handler)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/).*)',
  ],
};
