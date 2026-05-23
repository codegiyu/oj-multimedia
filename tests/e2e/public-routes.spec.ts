import { test } from '@playwright/test';
import { describeWithWebServer } from './helpers';
import { expectSmokePage } from './fixtures/expectSmokePage';
import { PUBLIC_CONTENT_ROUTES } from './fixtures/smokeRoutes';

describeWithWebServer('public content routes', () => {
  for (const route of PUBLIC_CONTENT_ROUTES) {
    test(`loads ${route.path}`, async ({ page }) => {
      await expectSmokePage(page, route);
    });
  }
});
