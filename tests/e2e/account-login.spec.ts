import { expect, test, type Page } from '@playwright/test';
import { describeWithWebServer } from './helpers';
import { mockAuthBackend, mockGoogleIdentity } from './fixtures/mockAuthBackend';

const ACCESS_COOKIE = 'oj-acc-client';

function waitForTokenSync(page: Page) {
  return page.waitForResponse(
    res => new URL(res.url()).pathname === '/api/auth/tokens' && res.request().method() === 'POST'
  );
}

async function clickGoogle(page: Page): Promise<void> {
  await page.goto('/auth/login', { waitUntil: 'domcontentloaded' });
  const button = page.getByRole('button', { name: /continue with google/i });
  // The button is disabled until the (stubbed) Google script has loaded.
  await expect(button).toBeEnabled({ timeout: 15_000 });
  await button.click();
}

describeWithWebServer('public (Google) login journey', () => {
  test('successful Google sign-in persists the session cookies @smoke', async ({
    page,
    context,
  }) => {
    await mockGoogleIdentity(page);
    await mockAuthBackend(page, { google: 'success' });

    const tokenSync = waitForTokenSync(page);
    await clickGoogle(page);

    expect((await tokenSync).status()).toBe(200);
    await expect(page.getByText('Successfully signed in!')).toBeVisible();

    const cookies = await context.cookies();
    expect(cookies.find(c => c.name === ACCESS_COOKIE)?.httpOnly).toBe(true);
  });

  test('a failed Google sign-in shows an error and stays on the login page', async ({
    page,
    context,
  }) => {
    await mockGoogleIdentity(page);
    await mockAuthBackend(page, { google: 'invalid-credentials' });

    await clickGoogle(page);

    await expect(page.getByText('Google login failed')).toBeVisible();
    await expect(page).toHaveURL(/\/auth\/login/);
    expect((await context.cookies()).some(c => c.name === ACCESS_COOKIE)).toBe(false);
  });

  test('a suspended account sees the suspended view, not a session', async ({ page, context }) => {
    await mockGoogleIdentity(page);
    await mockAuthBackend(page, { google: 'suspended' });

    await clickGoogle(page);

    await expect(page.getByRole('heading', { name: /account suspended/i })).toBeVisible();
    expect((await context.cookies()).some(c => c.name === ACCESS_COOKIE)).toBe(false);
  });

  test('cancelling the Google popup surfaces an error and no session', async ({
    page,
    context,
  }) => {
    await mockGoogleIdentity(page, { cancel: true });
    await mockAuthBackend(page);

    await clickGoogle(page);

    await expect(page.getByText(/cancelled or failed/i)).toBeVisible();
    expect((await context.cookies()).some(c => c.name === ACCESS_COOKIE)).toBe(false);
  });
});
