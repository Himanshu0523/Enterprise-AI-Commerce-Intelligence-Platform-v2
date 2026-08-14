import { NextResponse } from 'next/server';

const protectedRoutes = ['/'];
const authRoutes = ['/login'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get('admin_token')?.value;
  
  const isProtectedRoute = protectedRoutes.includes(pathname) || pathname.startsWith('/dashboard');
  const isAuthRoute = authRoutes.includes(pathname);
  
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
