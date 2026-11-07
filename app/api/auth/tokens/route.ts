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

function isTrustedOrigin(origin: string | null): boolean {
  const trusted = [
    process.env.NEXT_PUBLIC_BASE_URL,
    process.env.NEXT_SERVER_BASE_URL,
    // Allow localhost in non-production environments
    process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : null,
  ].filter(Boolean) as string[];
  return origin !== null && trusted.some(t => origin === t.replace(/\/$/, ''));
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get('origin');
  if (!isTrustedOrigin(origin)) {
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
