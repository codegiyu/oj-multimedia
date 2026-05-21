import { expect, test } from '@playwright/test';

test.describe('e2e contract (phase 0)', () => {
  test('playwright runner is wired', async () => {
    expect(true).toBe(true);
  });
});
