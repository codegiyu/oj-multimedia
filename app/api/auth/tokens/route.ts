import { NextRequest, NextResponse } from 'next/server';
import { AUTH_CLIENT_COOKIES } from '@/lib/constants/endpoints';

const ACCESS_COOKIE = AUTH_CLIENT_COOKIES.access;
const REFRESH_COOKIE = AUTH_CLIENT_COOKIES.refresh;
const ACCESS_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
const REFRESH_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

type TokenBody = {
  access?: string;
  refresh?: string;
};

function resolveCookieDomain(hostname: string): string | undefined {
  const configured = process.env.AUTH_COOKIE_DOMAIN || process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
  if (configured && configured.trim()) {
    return configured.trim();
  }
  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    return undefined;
  }
  return undefined;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json().catch(() => ({}))) as TokenBody;
  const access = (body.access ?? '').trim();
  const refresh = (body.refresh ?? '').trim();
  const secure = process.env.NODE_ENV === 'production';
  const domain = resolveCookieDomain(request.nextUrl.hostname);

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
