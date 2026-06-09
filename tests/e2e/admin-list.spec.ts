import { expect, test } from '@playwright/test';
import { describeWithWebServer } from './helpers';

describeWithWebServer('admin music list @smoke', () => {
  test('redirects unauthenticated users to admin login @smoke', async ({ page }) => {
    await page.goto('/admin/dashboard/music', { waitUntil: 'domcontentloaded' });

    await page.waitForURL(/\/admin\/auth\/login/, { timeout: 20_000 });
    expect(page.url()).toMatch(/\/admin\/auth\/login/);
  });

  test('admin login page remains reachable after redirect', async ({ page }) => {
    await page.goto('/admin/dashboard/music', { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/\/admin\/auth\/login/, { timeout: 20_000 });

    await expect(page.getByText(/sign in to your account/i).first()).toBeVisible();
  });
});
