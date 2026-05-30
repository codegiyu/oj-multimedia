import { expect, test } from '@playwright/test';
import { describeWithWebServer } from './helpers';
import { expectSmokePage } from './fixtures/expectSmokePage';
import { MARKETPLACE_ROUTES } from './fixtures/smokeRoutes';

describeWithWebServer('marketplace routes', () => {
  for (const route of MARKETPLACE_ROUTES) {
    test(`loads ${route.path}`, async ({ page }) => {
      await expectSmokePage(page, route);
    });
  }

  test('unknown product slug shows not-found UI', async ({ page }) => {
    await page.goto('/marketplace/products/e2e-smoke-missing-slug');

    await expect(page.getByRole('heading', { name: /product not found/i })).toBeVisible();
  });

  test('become-vendor page redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/marketplace/become-vendor');

    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('marketplace orders route redirects to account orders', async ({ page }) => {
    await page.goto('/marketplace/orders');

    await expect(page).toHaveURL(/\/account\/orders/);
  });
});
