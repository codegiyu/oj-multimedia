import { test } from '@playwright/test';
import { describeWithWebServer } from './helpers';
import { expectSmokePage, expectNotFoundCommunityDetail } from './fixtures/expectSmokePage';
import { COMMUNITY_API_ROUTES, COMMUNITY_DETAIL_NOT_FOUND_ROUTES } from './fixtures/smokeRoutes';

describeWithWebServer('community API routes (phase 2)', () => {
  for (const route of COMMUNITY_API_ROUTES) {
    test(`loads ${route.path}`, async ({ page }) => {
      await expectSmokePage(page, route);
    });
  }
});

describeWithWebServer('community detail not-found', () => {
  for (const route of COMMUNITY_DETAIL_NOT_FOUND_ROUTES) {
    test(`not found for ${route.path}`, async ({ page }) => {
      await expectNotFoundCommunityDetail(page, route.path, route.titlePattern!);
    });
  }
});
