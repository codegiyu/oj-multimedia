/**
 * Mobile homepage regression (manual QA viewports: 390, 360, 320).
 * Run: PLAYWRIGHT_USE_WEBSERVER=1 npm run test:e2e -- tests/e2e/home-mobile.spec.ts --project="iPhone 13"
 */
import { expect, test } from '@playwright/test';
import { describeWithWebServer } from './helpers';

describeWithWebServer('home page mobile', () => {
  test('has no horizontal overflow after load', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => undefined);

    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth + 1;
    });

    expect(overflow).toBe(false);
  });

  test('shows hero and primary section anchors', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('#music')).toBeVisible();
    await expect(page.locator('#videos')).toBeVisible();
    await expect(page.locator('#marketplace')).toBeVisible();
    await expect(page.locator('#community')).toBeVisible();
  });

  test('header icon controls meet minimum touch height', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header').first();
    const searchBtn = header.getByRole('button', { name: 'Search' });
    const box = await searchBtn.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  });

  test('shows mobile jump nav and unified news tabs on small viewport', async ({ page }) => {
    test.skip(
      test.info().project.name !== 'iPhone 13',
      'Jump nav and tab layout checks run on the mobile project only'
    );
    await page.goto('/');

    const jumpNav = page.getByRole('navigation', { name: 'Jump to homepage section' });
    await expect(jumpNav).toBeVisible();
    await expect(jumpNav.getByRole('link', { name: 'Music' })).toBeVisible();

    const newsTabs = page.getByRole('tablist', { name: 'News categories' });
    await expect(newsTabs).toBeVisible();
    await newsTabs.getByRole('tab', { name: 'Trending' }).click();
    await expect(page.locator('#news h2')).toContainText(/Trending news/i);
  });
});
