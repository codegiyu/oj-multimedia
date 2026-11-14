import { expect, test } from '@playwright/test';
import { describeWithWebServer } from './helpers';
import { fakeJwt } from './fixtures/mockAuthBackend';

/**
 * Regression guard for the production admin-login 403: behind a TLS-terminating proxy the
 * server sees its internal address, so the CSRF origin check must compare the Origin header with
 * the *public* host (x-forwarded-host), not with the request URL.
 */
describeWithWebServer('/api/auth/tokens behind a proxy @smoke', () => {
  const PUBLIC_HOST = 'ojmultimedia.test';
  // API-only checks: no browser involved, so one project is enough.
  test.beforeEach(() => {
    test.skip(test.info().project.name !== 'chromium', 'API-only; runs once');
  });

  const body = () => ({ access: fakeJwt(), refresh: fakeJwt(86_400) });

  test('accepts the public origin when x-forwarded-host matches @smoke', async ({ request }) => {
    const res = await request.post('/api/auth/tokens', {
      headers: {
        origin: `https://${PUBLIC_HOST}`,
        'x-forwarded-host': PUBLIC_HOST,
        'x-forwarded-proto': 'https',
      },
      data: body(),
    });

    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    const setCookie = res
      .headersArray()
      .filter(h => h.name.toLowerCase() === 'set-cookie')
      .map(h => h.value)
      .join('\n');
    expect(setCookie).toContain('oj-acc-client=');
    expect(setCookie).toContain('oj-ref-client=');
    expect(setCookie.toLowerCase()).toContain('httponly');
  });

  test('uses the first x-forwarded-host when a proxy chain appends several @smoke', async ({
    request,
  }) => {
    const res = await request.post('/api/auth/tokens', {
      headers: {
        origin: `https://${PUBLIC_HOST}`,
        'x-forwarded-host': `${PUBLIC_HOST}, internal-lb.local`,
      },
      data: body(),
    });

    expect(res.status()).toBe(200);
  });

  test('rejects an origin that does not match the public host @smoke', async ({ request }) => {
    const res = await request.post('/api/auth/tokens', {
      headers: {
        origin: 'https://evil.example',
        'x-forwarded-host': PUBLIC_HOST,
      },
      data: body(),
    });

    expect(res.status()).toBe(403);
    expect(res.headersArray().some(h => h.name.toLowerCase() === 'set-cookie')).toBe(false);
  });

  test('rejects a malformed origin @smoke', async ({ request }) => {
    const res = await request.post('/api/auth/tokens', {
      headers: { origin: 'not a url', 'x-forwarded-host': PUBLIC_HOST },
      data: body(),
    });

    expect(res.status()).toBe(403);
  });
});
