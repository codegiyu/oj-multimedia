import { test } from '@playwright/test';
import { describeWithWebServer } from './helpers';
import { expectNoCriticalA11yViolations } from './fixtures/a11y';

describeWithWebServer('critical journey accessibility', () => {
  test('home page has no critical axe violations', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);

    await expectNoCriticalA11yViolations(page, { context: 'home' });
  });

  test('music browse page has no critical axe violations', async ({ page }) => {
    await page.goto('/music/all', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined);

    await expectNoCriticalA11yViolations(page, { context: 'music browse' });
  });

  test('account login page has no critical axe violations', async ({ page }) => {
    await page.goto('/auth/login', { waitUntil: 'domcontentloaded' });

    await expectNoCriticalA11yViolations(page, { context: 'account login' });
  });

  test('admin login page has no critical axe violations', async ({ page }) => {
    await page.goto('/admin/auth/login', { waitUntil: 'domcontentloaded' });

    await expectNoCriticalA11yViolations(page, { context: 'admin login' });
  });
});
