import { expect, test, type Page } from '@playwright/test';
import { describeWithWebServer, waitForHydration } from './helpers';
import { mockAuthBackend } from './fixtures/mockAuthBackend';

const ACCESS_COOKIE = 'oj-acc-client';
const REFRESH_COOKIE = 'oj-ref-client';

/** The token route is how httpOnly session cookies get set, so a login that skips it is broken. */
function waitForTokenSync(page: Page) {
  return page.waitForResponse(
    res => new URL(res.url()).pathname === '/api/auth/tokens' && res.request().method() === 'POST'
  );
}

async function submitAdminLogin(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/admin/auth/login', { waitUntil: 'domcontentloaded' });
  const emailInput = page.getByLabel(/email or username/i);
  await waitForHydration(emailInput);
  await emailInput.fill(email);
  // Type the last field: useForm validates against the previous render, so one fill() event
  // would leave the submit button disabled.
  await page.locator('input[name="password"]').pressSequentially(password);
  await page.getByRole('button', { name: /^sign in$/i }).click();
}

describeWithWebServer('admin login journey', () => {
  test('valid credentials persist the session cookies and leave the login page @smoke', async ({
    page,
    context,
  }) => {
    await mockAuthBackend(page, { admin: 'success' });

    const tokenSync = waitForTokenSync(page);
    await submitAdminLogin(page, 'e2e-admin@example.com', 'Correct-horse-1');

    // Regression: a 403 here is what broke production admin login.
    expect((await tokenSync).status()).toBe(200);

    const cookies = await context.cookies();
    expect(cookies.find(c => c.name === ACCESS_COOKIE)?.httpOnly).toBe(true);
    expect(cookies.some(c => c.name === REFRESH_COOKIE)).toBe(true);

    await expect(page).not.toHaveURL(/\/admin\/auth\/login/, { timeout: 20_000 });
  });

  test('wrong credentials show the API error and set no session cookies', async ({
    page,
    context,
  }) => {
    await mockAuthBackend(page, { admin: 'invalid-credentials' });

    await submitAdminLogin(page, 'e2e-admin@example.com', 'wrong-password');

    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/auth\/login/);

    const names = (await context.cookies()).map(c => c.name);
    expect(names).not.toContain(ACCESS_COOKIE);
    expect(names).not.toContain(REFRESH_COOKIE);
  });
});
