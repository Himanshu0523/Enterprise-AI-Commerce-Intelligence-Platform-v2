import { NextResponse } from 'next/server';

export async function POST() {
  const result = NextResponse.json({ success: true });
  for (const name of ['admin_access', 'admin_refresh', 'admin_role']) {
    result.cookies.set(name, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
  }
  return result;
}
