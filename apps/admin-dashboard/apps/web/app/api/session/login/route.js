import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '').replace(/\/api$/, '') + '/api';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

async function authRequest(path, body) {
  const response = await fetch(`${API_ROOT}/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const raw = await response.text();
  let data = {};
  try { data = raw ? JSON.parse(raw) : {}; } catch { data = { msg: 'Authentication service returned an invalid response.' }; }
  return { response, data };
}

async function createSession(data) {
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
  result.cookies.set('admin_role', roles.join(','), { ...COOKIE_OPTIONS, maxAge: 15 * 60 });
  return result;
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const { response, data } = await authRequest('login', {
      email: email.trim().toLowerCase(),
      password,
    });
    if (!response.ok) {
      return NextResponse.json({ message: data.msg || data.message || 'Unable to sign in.' }, { status: response.status });
    }
    if (data.requireMFA) {
      return NextResponse.json({ requireMFA: true, mfaToken: data.mfaToken });
    }
    return createSession(data);
  } catch (error) {
    console.error('[ADMIN AUTH] Login failed:', error.message);
    return NextResponse.json({ message: 'Authentication service is unavailable.' }, { status: 502 });
  }
}
