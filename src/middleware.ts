import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply middleware if Clerk secret key is configured
  if (!process.env.CLERK_SECRET_KEY || process.env.CLERK_SECRET_KEY.startsWith('sk_test_placeholder')) {
    return NextResponse.next();
  }

  // If Clerk is properly configured, use Clerk middleware
  // For now, just pass through
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
