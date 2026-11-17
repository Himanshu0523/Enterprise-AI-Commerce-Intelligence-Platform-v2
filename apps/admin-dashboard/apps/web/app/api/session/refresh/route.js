import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '').replace(/\/api$/, '') + '/api';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('admin_refresh')?.value;
  if (!refreshToken) {
    return NextResponse.json({ message: 'Administrator session expired.' }, { status: 401 });
  }

  try {
    const refreshResponse = await fetch(`${API_ROOT}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });
    const tokens = await refreshResponse.json().catch(() => ({}));
    if (!refreshResponse.ok || !tokens.accessToken || !tokens.refreshToken) {
      return NextResponse.json({ message: 'Administrator session expired. Sign in again.' }, { status: 401 });
    }

    const validationResponse = await fetch(`${API_ROOT}/auth/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokens.accessToken }),
      cache: 'no-store',
    });
    const validation = await validationResponse.json().catch(() => ({}));
    const roles = Array.isArray(validation.user?.roles) ? validation.user.roles : [];
    if (!validationResponse.ok || !validation.valid || !roles.some((role) => ['admin', 'super_admin'].includes(String(role).toLowerCase()))) {
      return NextResponse.json({ message: 'Administrator access is no longer valid.' }, { status: 403 });
    }

    const result = NextResponse.json({ success: true });
    result.cookies.set('admin_access', tokens.accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 });
    result.cookies.set('admin_refresh', tokens.refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 });
    result.cookies.set('admin_role', roles.join(','), { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 });
    return result;
  } catch (error) {
    console.error('[ADMIN AUTH] Session refresh failed:', error.message);
    return NextResponse.json({ message: 'Authentication service is unavailable.' }, { status: 502 });
  }
}
