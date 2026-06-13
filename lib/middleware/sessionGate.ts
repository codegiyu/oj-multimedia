import { AUTH_CLIENT_COOKIES } from '@/lib/constants/endpoints';
import { base64UrlEncode } from '@/lib/services/storage';

const ADMIN_AUTH_PREFIX = '/admin/auth';
const CLIENT_AUTH_PREFIX = '/auth';

/** Admin routes reachable without an existing session cookie. */
export const ADMIN_PUBLIC_AUTH_PATHS = new Set([
  `${ADMIN_AUTH_PREFIX}/login`,
  `${ADMIN_AUTH_PREFIX}/accept-invite/create-password`,
  `${ADMIN_AUTH_PREFIX}/request-password-reset`,
  `${ADMIN_AUTH_PREFIX}/reset-password-mail-notification`,
  `${ADMIN_AUTH_PREFIX}/reset-password`,
]);

/** Client auth pages that must stay reachable while logged out. */
export const CLIENT_PUBLIC_AUTH_PATHS = new Set([
  `${CLIENT_AUTH_PREFIX}/login`,
  `${CLIENT_AUTH_PREFIX}/register`,
  `${CLIENT_AUTH_PREFIX}/forgot-password`,
  `${CLIENT_AUTH_PREFIX}/reset-password`,
  `${CLIENT_AUTH_PREFIX}/verify-email`,
]);

function readCookieValue(cookieHeader: string | null | undefined, name: string): string {
  if (!cookieHeader) return '';

  for (const pair of cookieHeader.split(';')) {
    const trimmed = pair.trim();
    const separator = trimmed.indexOf('=');

    if (separator <= 0) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();

    if (key === name && value.length > 0) return value;
  }

  return '';
}

export function hasSessionAuthCookie(cookieHeader: string | null | undefined): boolean {
  const access = readCookieValue(cookieHeader, AUTH_CLIENT_COOKIES.access);
  const refresh = readCookieValue(cookieHeader, AUTH_CLIENT_COOKIES.refresh);

  return access.length > 0 || refresh.length > 0;
}

function decodeJwtPayload(token: string): { exp?: number } | null {
  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(padded, 'base64').toString('utf8');

    return JSON.parse(json) as { exp?: number };
  } catch {
    return null;
  }
}

function isJwtNotExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;

  return payload.exp * 1000 > Date.now();
}

/** Edge UX gate: checks JWT exp claim without signature verification (API still verifies). */
export function hasValidSessionAuthCookie(cookieHeader: string | null | undefined): boolean {
  const access = readCookieValue(cookieHeader, AUTH_CLIENT_COOKIES.access);

  if (access.length > 0 && isJwtNotExpired(access)) return true;

  const refresh = readCookieValue(cookieHeader, AUTH_CLIENT_COOKIES.refresh);

  if (refresh.length > 0 && isJwtNotExpired(refresh)) return true;

  return false;
}

export function resolveProtectedRouteRedirect(pathname: string): string | null {
  const encodedPath = encodeURIComponent(base64UrlEncode(pathname));

  if (pathname.startsWith('/admin')) {
    if (ADMIN_PUBLIC_AUTH_PATHS.has(pathname)) return null;

    return `/admin/auth/login?redirectTo=${encodedPath}`;
  }

  if (pathname.startsWith('/account')) {
    return `/auth/login?redirectTo=${encodedPath}`;
  }

  return null;
}

export function shouldEnforceSessionCookie(pathname: string): boolean {
  if (pathname.startsWith('/admin')) {
    return !ADMIN_PUBLIC_AUTH_PATHS.has(pathname);
  }

  if (pathname.startsWith('/account')) {
    return true;
  }

  return false;
}

export function isPublicAuthPath(pathname: string): boolean {
  return ADMIN_PUBLIC_AUTH_PATHS.has(pathname) || CLIENT_PUBLIC_AUTH_PATHS.has(pathname);
}
