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

  test('marketplace orders route redirects to account orders (via login when signed out)', async ({
    page,
  }) => {
    await page.goto('/marketplace/orders');

    await expect(page).toHaveURL(/\/auth\/login\?redirectTo=/);
    const redirectTo = new URL(page.url()).searchParams.get('redirectTo') ?? '';
    expect(Buffer.from(redirectTo, 'base64url').toString('utf8')).toBe('/account/orders');
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
    // A tooltip wrapper also has role="button", so target the real submit button.
    const placeOrder = page.locator('button[type="submit"][aria-label="Place order"]');
    await expect(placeOrder).toBeDisabled();

    await page.getByLabel(/full name/i).fill('E2E Buyer');
    // Required fields render their label as "Email *", so allow the trailing marker.
    await page.getByLabel(/^email\s*\*?$/i).fill('e2e-buyer@example.com');
    await page.getByLabel(/^phone\s*\*?$/i).fill('+2348012345678');
    // Type (not fill) the last field: useForm validates against the previous render's values,
    // so a single input event leaves isValid one change behind. Real typing catches up.
    await page.getByLabel(/delivery address/i).pressSequentially('12 Test Street, Lagos');

    await expect(placeOrder).toBeEnabled();
  });
});
