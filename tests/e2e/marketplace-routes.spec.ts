import { expect, test } from '@playwright/test';
import { describeWithWebServer } from './helpers';
import { expectSmokePage } from './fixtures/expectSmokePage';
import { MARKETPLACE_ROUTES } from './fixtures/smokeRoutes';

describeWithWebServer('marketplace routes', () => {
  for (const route of MARKETPLACE_ROUTES) {
    test(`loads ${route.path}`, async ({ page }) => {
      await expectSmokePage(page, route);
    });
  }

  test('unknown product slug shows not-found UI', async ({ page }) => {
    await page.goto('/marketplace/products/e2e-smoke-missing-slug');

    await expect(page.getByRole('heading', { name: /product not found/i })).toBeVisible();
  });

  test('become-vendor page redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/marketplace/become-vendor');

    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('marketplace orders route redirects to account orders', async ({ page }) => {
    await page.goto('/marketplace/orders');

    await expect(page).toHaveURL(/\/account\/orders/);
  });

  test('checkout shows empty cart state by default', async ({ page }) => {
    await page.goto('/marketplace/checkout');

    await expect(page.getByRole('heading', { name: /your cart is empty/i })).toBeVisible();
  });

  test('checkout form requires fields before place order is enabled', async ({ page }) => {
    await page.goto('/marketplace');

    await page.evaluate(() => {
      localStorage.setItem(
        'marketplace-cart',
        JSON.stringify({
          state: {
            items: [
              {
                productId: 'e2e-product-1',
                slug: 'e2e-product-1',
                name: 'E2E Test Product',
                image: '/images/album-1.jpg',
                price: 1000,
                quantity: 1,
              },
            ],
          },
          version: 0,
        })
      );
    });

    await page.goto('/marketplace/checkout');

    await expect(page.getByRole('heading', { name: /^checkout$/i })).toBeVisible();
    await expect(page.getByText(/what happens when you place your order/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /place order/i })).toBeDisabled();

    await page.getByLabel(/full name/i).fill('E2E Buyer');
    await page.getByLabel(/^email$/i).fill('e2e-buyer@example.com');
    await page.getByLabel(/^phone$/i).fill('+2348012345678');
    await page.getByLabel(/delivery address/i).fill('12 Test Street, Lagos');

    await expect(page.getByRole('button', { name: /place order/i })).toBeEnabled();
  });
});
