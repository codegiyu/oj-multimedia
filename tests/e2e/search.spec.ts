import { expect, test } from '@playwright/test';
import { describeWithWebServer } from './helpers';

describeWithWebServer('search page', () => {
  test('renders the search page shell', async ({ page }) => {
    await page.goto('/search');

    await expect(page).toHaveTitle(/Search/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('accepts a query parameter on the search route', async ({ page }) => {
    await page.goto('/search?q=gospel');

    await expect(page).toHaveURL(/q=gospel/);
  });
});
