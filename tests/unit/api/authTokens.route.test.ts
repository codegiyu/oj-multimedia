import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { AUTH_CLIENT_COOKIES } from '@/lib/constants/endpoints';
import { POST } from '@/app/api/auth/tokens/route';

describe('POST /api/auth/tokens', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('sets httpOnly auth cookies when tokens are provided', async () => {
    vi.stubEnv('NODE_ENV', 'test');

    const request = new NextRequest('http://localhost/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access: 'access-token', refresh: 'refresh-token' }),
    });

    const response = await POST(request);
    const accessCookie = response.cookies.get(AUTH_CLIENT_COOKIES.access);
    const refreshCookie = response.cookies.get(AUTH_CLIENT_COOKIES.refresh);

    expect(response.status).toBe(200);
    expect(accessCookie?.value).toBe('access-token');
    expect(accessCookie?.httpOnly).toBe(true);
    expect(accessCookie?.sameSite).toBe('lax');
    expect(refreshCookie?.value).toBe('refresh-token');
    expect(refreshCookie?.httpOnly).toBe(true);
  });

  it('marks cookies secure in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const request = new NextRequest('http://localhost/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access: 'access-token' }),
    });

    const response = await POST(request);
    const accessCookie = response.cookies.get(AUTH_CLIENT_COOKIES.access);

    expect(accessCookie?.secure).toBe(true);
  });
});
