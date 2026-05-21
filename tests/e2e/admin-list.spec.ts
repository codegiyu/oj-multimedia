import { expect, test } from '@playwright/test';
import { describeWithWebServer } from './helpers';

describeWithWebServer('admin music list', () => {
  test('redirects unauthenticated users to admin login', async ({ page }) => {
    await page.goto('/admin/dashboard/music');

    await expect(page).toHaveURL(/\/admin\/auth\/login/);
  });

  test('admin login page remains reachable after redirect', async ({ page }) => {
    await page.goto('/admin/dashboard/music');
    await page.waitForURL(/\/admin\/auth\/login/);

    await expect(page.getByRole('heading', { name: /sign in to your account/i })).toBeVisible();
  });
});
