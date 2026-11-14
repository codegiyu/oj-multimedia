import { test, type Locator } from '@playwright/test';

/** Browser e2e that need a running Next dev server. */
export const describeWithWebServer =
  process.env.PLAYWRIGHT_USE_WEBSERVER === '1' ? test.describe : test.describe.skip;

/** True when CI or local smoke runs start the Next dev server. */
export const isWebServerSmokeEnabled = process.env.PLAYWRIGHT_USE_WEBSERVER === '1';

/**
 * Resolves once React has hydrated the element. Acting earlier is unreliable: a value filled into
 * a controlled input before hydration is reset to the initial state when React takes over (seen
 * on slower WebKit dev runs, where hydration finishes seconds after the `load` event).
 */
export async function waitForHydration(locator: Locator): Promise<void> {
  await locator.waitFor({ state: 'visible' });
  await locator
    .page()
    .waitForFunction(
      el => !!el && Object.keys(el).some(key => key.startsWith('__reactProps$')),
      await locator.elementHandle(),
      { timeout: 30_000 }
    );
}
