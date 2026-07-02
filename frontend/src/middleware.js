import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Define protected route prefixes
  const protectedPaths = ['/user', '/admin', '/owner', '/driver'];
  
  // Check if current path starts with any of the protected paths
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  if (isProtectedPath) {
    // Check for access_token or refresh_token
    const hasToken = request.cookies.has('access_token') || request.cookies.has('refresh_token');
    
    if (!hasToken) {
      // Redirect to login if no token is present
      const loginUrl = new URL('/auth/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/user/:path*',
    '/admin/:path*',
    '/owner/:path*',
    '/driver/:path*'
  ]
};
