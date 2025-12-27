import { NextResponse } from 'next/server';
import { decrypt } from '@/server/actions/auth';
import { cookies } from 'next/headers';

const protectedRoutes = ['/', '/equipment', '/teams', '/maintenance'];
const authRoutes = ['/login', '/signup'];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route) && path !== '/login' && path !== '/signup');
  const isAuthRoute = authRoutes.includes(path);

  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);

  // Redirect to /login if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }
  
  // Protect /teams route (Manager Only)
  if (path.startsWith('/teams') && session?.role !== 'MANAGER') {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  // Redirect to / if accessing auth routes while logged in
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
