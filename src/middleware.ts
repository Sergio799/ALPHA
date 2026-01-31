import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes that don't need authentication
  const publicRoutes = [
    '/',
    '/sign-in',
    '/sign-up',
    '/api/health',
    '/api/stock-price',
    '/api/stock-prices',
    '/api/stock-search',
    '/api/test-price',
  ];

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // If it's a public route, allow it
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check if user has auth cookie
  const authCookie = request.cookies.get('__session');
  
  if (!authCookie && pathname.startsWith('/dashboard')) {
    // Redirect to sign-in if trying to access dashboard without auth
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
