import { NextRequest, NextResponse } from 'next/server';
import { AUTH_CLIENT_COOKIES } from '@/lib/constants/endpoints';
import { resolveAuthCookieDomain } from '@/lib/utils/authCookieDomain';

const ACCESS_COOKIE = AUTH_CLIENT_COOKIES.access;
const REFRESH_COOKIE = AUTH_CLIENT_COOKIES.refresh;
const ACCESS_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
const REFRESH_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

type TokenBody = {
  access?: string;
  refresh?: string;
};

// Behind a proxy the standalone server sees its internal address (HOSTNAME=0.0.0.0) in
// nextUrl, so the public host must come from the forwarded/Host headers.
function getPublicHost(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('host') || request.nextUrl.host;
}

function isTrustedOrigin(
  origin: string | null,
  publicHost: string,
  isProduction: boolean
): boolean {
  // Browsers may omit Origin for same-origin fetches, but in production we require
  // an explicit Origin so non-browser callers (curl, Postman) cannot inject tokens.
  if (origin === null) return !isProduction;
  try {
    return new URL(origin).host === publicHost;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get('origin');
  if (!isTrustedOrigin(origin, getPublicHost(request), process.env.NODE_ENV === 'production')) {
    return NextResponse.json({ ok: false, message: 'Forbidden' }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as TokenBody;
  const access = (body.access ?? '').trim();
  const refresh = (body.refresh ?? '').trim();
  const secure = process.env.NODE_ENV === 'production';
  const domain = resolveAuthCookieDomain(
    request.nextUrl.hostname,
    process.env.AUTH_COOKIE_DOMAIN || process.env.NEXT_PUBLIC_COOKIE_DOMAIN
  );

  const res = NextResponse.json({ ok: true });

  if (access) {
    res.cookies.set(ACCESS_COOKIE, access, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: ACCESS_MAX_AGE_SECONDS,
      ...(domain ? { domain } : {}),
    });
  } else {
    res.cookies.set(ACCESS_COOKIE, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: 0,
      ...(domain ? { domain } : {}),
    });
  }

  if (refresh) {
    res.cookies.set(REFRESH_COOKIE, refresh, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: REFRESH_MAX_AGE_SECONDS,
      ...(domain ? { domain } : {}),
    });
  } else {
    res.cookies.set(REFRESH_COOKIE, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: 0,
      ...(domain ? { domain } : {}),
    });
  }

  return res;
}
