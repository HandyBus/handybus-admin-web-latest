import { type NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from './services/auth';

export const middleware = async (req: NextRequest) => {
  const session = await getAccessToken();
  if (!session) {
    return NextResponse.rewrite(new URL('/login', req.url));
  }
};

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - login
     * - logout
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login|$).*)',
  ],
};
