import { describe, expect, it } from 'vitest';
import {
  ADMIN_PUBLIC_AUTH_PATHS,
  hasSessionAuthCookie,
  resolveProtectedRouteRedirect,
  shouldEnforceSessionCookie,
} from '@/lib/middleware/sessionGate';
import { AUTH_CLIENT_COOKIES } from '@/lib/constants/endpoints';

describe('sessionGate middleware helpers', () => {
  it('detects session cookies from access or refresh client tokens', () => {
    expect(hasSessionAuthCookie(undefined)).toBe(false);
    expect(hasSessionAuthCookie('')).toBe(false);
    expect(hasSessionAuthCookie(`${AUTH_CLIENT_COOKIES.access}=abc123; other=value`)).toBe(true);
    expect(hasSessionAuthCookie(`${AUTH_CLIENT_COOKIES.refresh}=refresh-token`)).toBe(true);
    expect(
      hasSessionAuthCookie(`${AUTH_CLIENT_COOKIES.access}=; ${AUTH_CLIENT_COOKIES.refresh}=`)
    ).toBe(false);
  });

  it('allows admin auth pages without a session cookie', () => {
    for (const path of ADMIN_PUBLIC_AUTH_PATHS) {
      expect(shouldEnforceSessionCookie(path)).toBe(false);
    }

    expect(shouldEnforceSessionCookie('/admin/dashboard/home')).toBe(true);
  });

  it('requires session cookies for account routes', () => {
    expect(shouldEnforceSessionCookie('/account/settings')).toBe(true);
  });

  it('builds login redirects for protected admin and account routes', () => {
    expect(resolveProtectedRouteRedirect('/admin/dashboard/music')).toContain(
      '/admin/auth/login?redirectTo='
    );
    expect(resolveProtectedRouteRedirect('/account/orders')).toContain('/auth/login?redirectTo=');
    expect(resolveProtectedRouteRedirect('/admin/auth/login')).toBeNull();
  });
});
