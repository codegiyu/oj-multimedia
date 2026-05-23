import { test } from '@playwright/test';

/** Browser e2e that need a running Next dev server. */
export const describeWithWebServer =
  process.env.PLAYWRIGHT_USE_WEBSERVER === '1' ? test.describe : test.describe.skip;

/** True when CI or local smoke runs start the Next dev server. */
export const isWebServerSmokeEnabled = process.env.PLAYWRIGHT_USE_WEBSERVER === '1';
