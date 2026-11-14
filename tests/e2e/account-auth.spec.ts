import { expect, test } from '@playwright/test';
import { describeWithWebServer } from './helpers';
import { expectSmokePage } from './fixtures/expectSmokePage';
import { ACCOUNT_PROTECTED_ROUTES, CLIENT_AUTH_ROUTES } from './fixtures/smokeRoutes';

describeWithWebServer('client auth routes', () => {
  for (const route of CLIENT_AUTH_ROUTES) {
    test(`loads ${route.path}`, async ({ page }) => {
      await expectSmokePage(page, route);
    });
  }

  test('login page shows sign-in heading and exit links', async ({ page }) => {
    await page.goto('/auth/login', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /sign in/i }).first()).toBeVisible();

    // The back-to-home link is `md:hidden`, so it only exists on small viewports.
    const isSmallViewport = (page.viewportSize()?.width ?? Infinity) < 768;
    if (isSmallViewport) {
      await expect(page.getByRole('link', { name: /back to home/i })).toBeVisible();
    } else {
      await expect(page.getByRole('link', { name: /back to home/i })).toBeHidden();
    }
  });
});

describeWithWebServer('account route protection', () => {
  for (const path of ACCOUNT_PROTECTED_ROUTES) {
    test(`redirects unauthenticated ${path} to client login`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });

      await page.waitForURL(/\/auth\/login/, { timeout: 20_000 });
      expect(page.url()).toMatch(/\/auth\/login/);
      expect(page.url()).toMatch(/redirectTo=/);
    });
  }
});
