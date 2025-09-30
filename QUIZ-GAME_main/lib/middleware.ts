// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Allow the login page itself
  if (pathname === '/admin/login') return NextResponse.next();

  // Protect all other /admin routes
  if (pathname.startsWith('/admin')) {
    const authed = req.cookies.get('admin_auth')?.value === '1';

    // If already signed in, continue
    if (authed) return NextResponse.next();

    // Otherwise, bounce to the login page and preserve the target
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set(
      'next',
      pathname + (searchParams.toString() ? `?${searchParams}` : '')
    );
    return NextResponse.redirect(url);
  }

  // Non-/admin routes are untouched
  return NextResponse.next();
}

// Only run this middleware for /admin routes
export const config = {
  matcher: ['/admin/:path*'],
};
