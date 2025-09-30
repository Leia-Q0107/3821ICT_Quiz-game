// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const COOKIE_NAME = 'admin_auth_v2'; // new name so old cookies are ignored
const LOGIN_PATH = '/admin/login';

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Always allow the login page itself
  if (pathname === LOGIN_PATH) return NextResponse.next();

  // Protect EVERYTHING under /admin (including /admin itself)
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const authed = req.cookies.get(COOKIE_NAME)?.value === '1';
    if (authed) return NextResponse.next();

    // Not authenticated → send to login and preserve target
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set(
      'next',
      pathname + (searchParams.toString() ? `?${searchParams}` : '')
    );
    return NextResponse.redirect(url);
  }

  // Non-admin routes pass through
  return NextResponse.next();
}

// Match both the bare /admin and its subpaths
export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
