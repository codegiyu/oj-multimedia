import { expect, test } from '@playwright/test';
import { describeWithWebServer } from './helpers';

describeWithWebServer('admin sign-in', () => {
  test('shows the admin login form', async ({ page }) => {
    await page.goto('/admin/auth/login', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText(/sign in to your account/i).first()).toBeVisible();
    await expect(page.getByLabel(/email or username/i)).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i }).last()).toBeVisible();
  });
});
