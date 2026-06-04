import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers:
    process.env.PLAYWRIGHT_USE_WEBSERVER === '1' || process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL,
    navigationTimeout: 45_000,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'iPhone 13', use: { ...devices['iPhone 13'] } },
  ],
  // Enable with PLAYWRIGHT_USE_WEBSERVER=1 when running browser tests against a live app.
  webServer:
    process.env.PLAYWRIGHT_USE_WEBSERVER === '1'
      ? {
          command: 'npm run dev',
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        }
      : undefined,
});
