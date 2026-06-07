import { test, expect } from '@playwright/test';
import { describeWithWebServer } from './helpers';
import { BROWSE_ALL_ROUTES } from './fixtures/browseAllRoutes';

describeWithWebServer('browse all pages', () => {
  for (const route of BROWSE_ALL_ROUTES) {
    test(`loads ${route.path} with search toolbar`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBeLessThan(500);
      await expect(page).toHaveTitle(route.titlePattern);

      if (route.toolbarSelector) {
        await expect(page.locator(route.toolbarSelector).first()).toBeVisible();
      }
    });
  }

  test('music hero links to browse all', async ({ page }) => {
    await page.goto('/music');
    await page.getByRole('link', { name: /Browse All Music/i }).click();
    await expect(page).toHaveURL(/\/music\/all/);
    await expect(page.locator('input[type="search"]').first()).toBeVisible();
  });
});
