// app/api/admin/login/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// simple probe so you can hit /api/admin/login in the browser
export async function GET() {
  return NextResponse.json({ ok: true, route: '/api/admin/login' });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad JSON' }, { status: 400 });
  }

  const { username, password } = (body ?? {}) as {
    username?: string;
    password?: string;
  };

  const u = process.env.ADMIN_USER ?? 'admin';
  const p = process.env.ADMIN_PASS ?? '123';

  if (username === u && password === p) {
    const res = NextResponse.json({ ok: true });
    // cookie name matches middleware.ts (COOKIE_NAME = 'admin_auth_v2')
    res.cookies.set('admin_auth_v2', '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
    return res;
  }

  return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
}
