import { expect, type Page } from '@playwright/test';
import type { SmokeRoute } from './smokeRoutes';

const DEFAULT_GOTO_OPTIONS = { waitUntil: 'domcontentloaded' as const };

export async function expectSmokePage(page: Page, route: SmokeRoute): Promise<void> {
  const response = await page.goto(route.path, DEFAULT_GOTO_OPTIONS);
  const expectedStatus = route.expectStatus ?? 200;

  if (expectedStatus === 404) {
    const status = response?.status() ?? 0;
    expect([200, 404]).toContain(status);
  } else {
    expect(response?.ok()).toBe(true);
  }

  await expect(page.locator('body')).toBeVisible();

  if (route.titlePattern) {
    await expect(page).toHaveTitle(route.titlePattern, { timeout: 15_000 });
  }
}

export async function expectNotFoundCommunityDetail(
  page: Page,
  path: string,
  titlePattern: RegExp
): Promise<void> {
  const response = await page.goto(path, DEFAULT_GOTO_OPTIONS);
  const status = response?.status() ?? 0;

  expect([200, 404]).toContain(status);
  await expect(page).toHaveTitle(titlePattern, { timeout: 15_000 });
}
