import { expect, test } from '@playwright/test';
import { describeWithWebServer } from './helpers';
import { expectSmokePage } from './fixtures/expectSmokePage';

const ALBUM_LIST_ROUTE = {
  path: '/music/albums',
  titlePattern: /Albums/i,
} as const;

const ALBUM_DETAIL_NOT_FOUND = {
  path: '/music/albums/e2e-smoke-missing-id',
  titlePattern: /Page Not Found/i,
} as const;

describeWithWebServer('public album routes', () => {
  test('loads the albums list page', async ({ page }) => {
    await expectSmokePage(page, ALBUM_LIST_ROUTE);
    await expect(page.getByRole('heading', { name: /Albums/i }).first()).toBeVisible();
  });

  test('returns not found for a missing album detail', async ({ page }) => {
    await expectSmokePage(page, ALBUM_DETAIL_NOT_FOUND);
  });

  test('navigates from albums list to detail when published albums exist', async ({ page }) => {
    await page.goto('/music/albums', { waitUntil: 'domcontentloaded' });

    const albumLink = page.locator('a[href^="/music/albums/"]').first();
    const count = await albumLink.count();

    test.skip(count === 0, 'No published albums in this environment');

    const href = await albumLink.getAttribute('href');
    expect(href).toMatch(/^\/music\/albums\/.+/);

    await albumLink.click();
    await expect(page).toHaveURL(new RegExp(`^${href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
    await expect(page.locator('body')).toBeVisible();
    await expect(page.getByText(/Album/i).first()).toBeVisible();
  });
});

describeWithWebServer('search album discovery', () => {
  test('album filter tab is available when searching', async ({ page }) => {
    await page.goto('/search?q=gospel', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: /Albums/i })).toBeVisible();
  });

  test('navigates from album search results to album detail when results exist', async ({
    page,
  }) => {
    await page.goto('/search?q=gospel&type=album', { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveURL(/type=album/);

    const albumLink = page.locator('a[href^="/music/albums/"]').first();
    const count = await albumLink.count();

    test.skip(count === 0, 'No album search results in this environment');

    const href = await albumLink.getAttribute('href');
    expect(href).toMatch(/^\/music\/albums\/.+/);

    await albumLink.click();
    await expect(page).toHaveURL(new RegExp(`^${href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
    await expect(page.locator('body')).toBeVisible();
  });
});
