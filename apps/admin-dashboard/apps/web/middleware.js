import { NextResponse } from 'next/server';

const protectedRoutes = ['/'];
const authRoutes = ['/login'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('admin_access')?.value;
  const refreshToken = request.cookies.get('admin_refresh')?.value;
  const roles = (request.cookies.get('admin_role')?.value || '').split(',');
  const hasAdminRole = roles.some((role) => ['admin', 'super_admin'].includes(role.trim().toLowerCase()));
  const isProtectedRoute = protectedRoutes.includes(pathname) || pathname.startsWith('/dashboard');
  const isAuthRoute = authRoutes.includes(pathname);

  // Middleware is a navigation gate only. All /api/admin operations must still
  // validate the JWT and role at the API gateway.
  if (isProtectedRoute && ((!accessToken && !refreshToken) || !hasAdminRole)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && (accessToken || refreshToken) && hasAdminRole) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
