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

    const request = new NextRequest('http://localhost:3000/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', origin: 'http://localhost:3000' },
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

  it('allows same-origin requests with no Origin header', async () => {
    vi.stubEnv('NODE_ENV', 'test');

    const request = new NextRequest('http://localhost:3000/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access: 'access-token' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  it('rejects cross-origin requests', async () => {
    vi.stubEnv('NODE_ENV', 'test');

    const request = new NextRequest('http://localhost:3000/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', origin: 'https://evil.com' },
      body: JSON.stringify({ access: 'stolen-token' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
  });

  it('marks cookies secure in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const request = new NextRequest('https://example.com/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', origin: 'https://example.com' },
      body: JSON.stringify({ access: 'access-token' }),
    });

    const response = await POST(request);
    const accessCookie = response.cookies.get(AUTH_CLIENT_COOKIES.access);

    expect(accessCookie?.secure).toBe(true);
  });

  it('accepts the public origin when nextUrl is the internal container address', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const request = new NextRequest('http://0.0.0.0:3000/api/auth/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://ojmultimedia.com',
        host: 'ojmultimedia.com',
        'x-forwarded-host': 'ojmultimedia.com',
        'x-forwarded-proto': 'https',
      },
      body: JSON.stringify({ access: 'access-token' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  it('rejects a foreign origin behind the proxy', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const request = new NextRequest('http://0.0.0.0:3000/api/auth/tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://evil.com',
        'x-forwarded-host': 'ojmultimedia.com',
      },
      body: JSON.stringify({ access: 'stolen-token' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
  });

  it('rejects requests with no Origin header in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const request = new NextRequest('https://example.com/api/auth/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access: 'access-token' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
  });
});
