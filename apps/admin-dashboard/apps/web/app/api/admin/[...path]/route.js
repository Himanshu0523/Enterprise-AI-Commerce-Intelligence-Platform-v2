import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '').replace(/\/api$/, '') + '/api';

async function proxy(request, context) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('admin_access')?.value;
  if (!accessToken) {
    return NextResponse.json({ success: false, message: 'Administrator session required.' }, { status: 401 });
  }

  const { path = [] } = await context.params;
  const incomingUrl = new URL(request.url);
  const targetUrl = `${API_ROOT}/admin/${path.map(encodeURIComponent).join('/')}${incomingUrl.search}`;
  const headers = new Headers({ Authorization: `Bearer ${accessToken}` });
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);

  const init = { method: request.method, headers, cache: 'no-store' };
  if (!['GET', 'HEAD'].includes(request.method)) {
    init.body = await request.text();
  }

  try {
    const upstream = await fetch(targetUrl, init);
    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[ADMIN API PROXY] Upstream request failed:', error.message);
    return NextResponse.json({ success: false, message: 'Admin API is temporarily unavailable.' }, { status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
