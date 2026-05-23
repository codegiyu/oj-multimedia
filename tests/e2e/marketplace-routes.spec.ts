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
});
