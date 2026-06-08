import { NextResponse, type NextRequest } from 'next/server';
import {
  hasSessionAuthCookie,
  resolveProtectedRouteRedirect,
  shouldEnforceSessionCookie,
} from '@/lib/middleware/sessionGate';

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (!shouldEnforceSessionCookie(pathname)) {
    return NextResponse.next();
  }

  if (hasSessionAuthCookie(request.headers.get('cookie'))) {
    return NextResponse.next();
  }

  const loginPath = resolveProtectedRouteRedirect(pathname);

  if (!loginPath) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  const [path, query = ''] = loginPath.split('?');

  loginUrl.pathname = path;
  loginUrl.search = query ? `?${query}` : '';

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
