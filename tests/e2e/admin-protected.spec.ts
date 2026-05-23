import { expect, test } from '@playwright/test';
import { describeWithWebServer } from './helpers';
import { expectSmokePage } from './fixtures/expectSmokePage';
import { ADMIN_PROTECTED_ROUTES, ADMIN_UNPROTECTED_ROUTES } from './fixtures/smokeRoutes';

describeWithWebServer('admin unprotected auth pages', () => {
  for (const route of ADMIN_UNPROTECTED_ROUTES) {
    test(`loads ${route.path}`, async ({ page }) => {
      await expectSmokePage(page, route);
    });
  }

  test('accept-invite page shows invite or invalid-link copy', async ({ page }) => {
    await page.goto('/admin/auth/accept-invite/create-password', { waitUntil: 'domcontentloaded' });

    await expect(
      page
        .getByText(/invalid invite link|create your password|activate your admin account/i)
        .first()
    ).toBeVisible({ timeout: 15_000 });
  });
});

describeWithWebServer('admin dashboard protection', () => {
  for (const path of ADMIN_PROTECTED_ROUTES) {
    test(`redirects unauthenticated ${path} to admin login`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });

      await page.waitForURL(/\/admin\/auth\/login/, { timeout: 30_000 });
      expect(page.url()).toMatch(/\/admin\/auth\/login/);
    });
  }
});
