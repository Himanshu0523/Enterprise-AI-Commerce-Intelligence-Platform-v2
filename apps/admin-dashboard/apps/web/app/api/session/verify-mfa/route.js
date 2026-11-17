import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '').replace(/\/api$/, '') + '/api';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

export async function POST(request) {
  try {
    const { mfaToken, token } = await request.json();
    if (typeof mfaToken !== 'string' || typeof token !== 'string' || !/^\d{6}$/.test(token)) {
      return NextResponse.json({ message: 'Enter the six-digit authenticator code.' }, { status: 400 });
    }

    const upstream = await fetch(`${API_ROOT}/auth/mfa/verify-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mfaToken, token }),
      cache: 'no-store',
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return NextResponse.json({ message: data.msg || 'MFA verification failed.' }, { status: upstream.status });
    }

    if (!data.accessToken || !data.refreshToken || !data.user) {
      return NextResponse.json({ message: 'Authentication service returned an incomplete session.' }, { status: 502 });
    }
    const roles = Array.isArray(data.user.roles) ? data.user.roles : [];
    if (!roles.some((role) => ['admin', 'super_admin'].includes(String(role).toLowerCase()))) {
      return NextResponse.json({ message: 'This account does not have administrator access.' }, { status: 403 });
    }

    const result = NextResponse.json({
      success: true,
      user: { id: data.user.id, name: data.user.name, email: data.user.email, roles },
    });
    result.cookies.set('admin_access', data.accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 });
    result.cookies.set('admin_refresh', data.refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 });
    result.cookies.set('admin_role', roles.join(','), { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 });
    return result;
  } catch (error) {
    console.error('[ADMIN AUTH] MFA verification failed:', error.message);
    return NextResponse.json({ message: 'Authentication service is unavailable.' }, { status: 502 });
  }
}
