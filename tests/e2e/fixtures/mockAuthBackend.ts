import type { Page, Route } from '@playwright/test';

/** Header names the backend uses to hand tokens to the browser (see AUTH_TOKEN_HEADERS). */
const ACCESS_HEADER = 'oj-acc-token';
const REFRESH_HEADER = 'oj-ref-token';

function base64Url(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

/** Unsigned JWT with a future exp: enough for the edge session gate, never accepted by a real API. */
export function fakeJwt(lifetimeSeconds = 3600): string {
  const exp = Math.floor(Date.now() / 1000) + lifetimeSeconds;
  return `${base64Url({ alg: 'none', typ: 'JWT' })}.${base64Url({ sub: 'e2e-user', exp })}.e2e`;
}

export const E2E_ADMIN = {
  _id: 'e2e-admin-1',
  email: 'e2e-admin@example.com',
  username: 'e2e-admin',
  firstName: 'E2E',
  lastName: 'Admin',
  role: 'admin',
  isSuperAdmin: true,
  permissions: [],
} as const;

export const E2E_USER = {
  _id: 'e2e-user-1',
  email: 'e2e-user@example.com',
  firstName: 'E2E',
  lastName: 'User',
  phoneNumber: '+2348000000000',
} as const;

type AuthOutcome = 'success' | 'invalid-credentials' | 'suspended';

export type MockAuthOptions = {
  admin?: AuthOutcome;
  google?: AuthOutcome;
};

function corsHeaders(route: Route): Record<string, string> {
  const origin = route.request().headers()['origin'] ?? '*';

  return {
    'access-control-allow-origin': origin,
    'access-control-allow-credentials': 'true',
    'access-control-allow-headers': '*',
    'access-control-allow-methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
    // The browser can only read the token headers if the API exposes them.
    'access-control-expose-headers': `${ACCESS_HEADER}, ${REFRESH_HEADER}`,
  };
}

async function fulfillJson(
  route: Route,
  status: number,
  body: unknown,
  extraHeaders: Record<string, string> = {}
): Promise<void> {
  await route.fulfill({
    status,
    contentType: 'application/json',
    headers: { ...corsHeaders(route), ...extraHeaders },
    body: JSON.stringify(body),
  });
}

function tokenHeaders(): Record<string, string> {
  return { [ACCESS_HEADER]: fakeJwt(), [REFRESH_HEADER]: fakeJwt(86_400) };
}

function respondToLogin(
  route: Route,
  outcome: AuthOutcome,
  user: unknown,
  failureMessage: string
): Promise<void> {
  if (outcome === 'success') {
    return fulfillJson(
      route,
      200,
      { success: true, message: 'ok', data: { user } },
      tokenHeaders()
    );
  }

  if (outcome === 'suspended') {
    return fulfillJson(route, 403, {
      success: false,
      message: 'Your account has been suspended',
      responseCode: 403,
      data: { code: 'ACCOUNT_SUSPENDED' },
    });
  }

  return fulfillJson(route, 401, { success: false, message: failureMessage, responseCode: 401 });
}

/**
 * Stubs the backend auth endpoints the browser talks to, so login journeys run without a real
 * API. Server-side (RSC) calls are not intercepted. Only requests made by the page are.
 */
export async function mockAuthBackend(page: Page, options: MockAuthOptions = {}): Promise<void> {
  const { admin = 'success', google = 'success' } = options;

  await page.route('**/api/v1/**', async route => {
    const request = route.request();
    const { pathname } = new URL(request.url());

    if (request.method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: corsHeaders(route) });
      return;
    }

    if (pathname.endsWith('/auth/login')) {
      await respondToLogin(route, admin, E2E_ADMIN, 'Invalid credentials');
      return;
    }

    if (pathname.endsWith('/auth/google')) {
      await respondToLogin(route, google, E2E_USER, 'Google login failed');
      return;
    }

    // Anything else (session init, settings, favourites…) reports "not signed in / empty".
    await fulfillJson(route, 401, { success: false, message: 'Unauthorized', responseCode: 401 });
  });
}

/** Replaces Google's GSI script with a stub whose popup immediately returns an auth code. */
export async function mockGoogleIdentity(
  page: Page,
  options: { cancel?: boolean } = {}
): Promise<void> {
  await page.route('https://accounts.google.com/gsi/client', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `window.google = { accounts: { oauth2: { initCodeClient: function (config) {
        return { requestCode: function () {
          ${
            options.cancel
              ? 'config.error_callback && config.error_callback({ type: "popup_closed" });'
              : 'config.callback({ code: "e2e-google-code" });'
          }
        } };
      } } } };`,
    })
  );
}
