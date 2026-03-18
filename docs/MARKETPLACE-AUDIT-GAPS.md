# Marketplace Pages — Audit: UI, Logic & Gaps

Audit of the marketplace route set (`/marketplace/*`) for missing layout, backend integration, UX, and consistency.

---

## 1. Critical / Logic Gaps

### 1.1 Orders page uses mock data only
- **Where:** `app/marketplace/orders/page.tsx` → `OrdersPageClient.tsx`
- **Issue:** `OrdersPageClient` calls `getMockOrders()` from `lib/utils/marketplace.ts`. No API request is made; users never see real orders.
- **Fix:** Use `MARKETPLACE_GET_MY_ORDERS` (or equivalent) when the user is authenticated. Show loading and empty state when unauthenticated or when the API returns no orders.

### 1.2 Become a vendor form does not submit to backend
- **Where:** `BecomeVendorPageClient.tsx`
- **Issue:** Submit handler only does `await new Promise(r => setTimeout(r, 600))` then shows success. No call to `MARKETPLACE_BECOME_VENDOR` (POST `/marketplace/become-vendor`).
- **Fix:** POST the form payload to the become-vendor endpoint; on success show the “Application received” state; on error show validation/API errors.

### 1.3 Cart is client-only; no backend cart for logged-in users
- **Where:** Cart flow (cart store, Cart page, Checkout)
- **Issue:** Cart is persisted only in Zustand (`marketplace-cart`). Per `docs/MARKETPLACE-PLAN-CART-AND-VENDOR-UPDATES.md`, when the user is logged in the cart should come from the backend (GET/POST/PATCH/DELETE cart) and optionally merge with local cart on login.
- **Fix:** Implement backend cart integration: fetch cart on load when authenticated, sync add/update/remove with API, and optionally merge guest cart into backend cart on login.

### 1.4 Product detail: Add to cart allowed when out of stock
- **Where:** `ProductDetailClient.tsx`
- **Issue:** “Out of stock” is shown below the buttons, but “Add to cart” remains enabled. Users can add out-of-stock items.
- **Fix:** Disable the “Add to cart” button when `!product.inStock` and keep the “Out of stock” message.

### 1.5 Product detail: vendor link when `vendor` is populated
- **Where:** `ProductDetailClient.tsx` — vendor link uses `product.vendorSlug ?? product.vendor`
- **Issue:** If the API returns a populated `vendor` object, `product.vendor` may be an object, not a slug string. The link could be wrong (e.g. `[object Object]`).
- **Fix:** Resolve vendor slug explicitly: prefer `product.vendorSlug`, then if `product.vendor` is a string use it, else if it’s an object use `(product.vendor as { slug?: string }).slug`. Type the API response so `vendor` is either `string` or a known shape with `slug`.

---

## 2. UI / Layout Gaps

### 2.1 Marketplace search page missing MainLayout
- **Where:** `MarketplaceSearchPageClient.tsx`
- **Issue:** This is the only marketplace client that does **not** wrap content in `<MainLayout>`. The search page renders only `<SectionContainer>`, so it lacks the site header/footer/nav that other marketplace pages have.
- **Fix:** Wrap the search page content in `<MainLayout>`, consistent with `MarketplaceProductsPageClient`, `MarketplaceVendorsPageClient`, and `VendorStorePageClient`.

### 2.2 ProductCard: no direct WhatsApp link when product has vendor WhatsApp
- **Where:** `ProductCard.tsx`
- **Issue:** “Chat” always links to `/marketplace/vendors/${slug}?chat=1`. On product detail, when the product has `vendorPopulated?.whatsapp`, the app uses a direct `wa.me` link. Cards do not, so UX is inconsistent and one extra click.
- **Fix:** If the product has `(product as IMarketplaceProduct).vendorPopulated?.whatsapp`, render an `<a href={wa.me link}>` for “Chat”; otherwise keep the current vendor page link.

### 2.3 Vendor store page: no “Contact vendor” / WhatsApp
- **Where:** `VendorStorePageClient.tsx`
- **Issue:** `IMarketplaceVendor` includes `whatsapp`. The vendor header has no “Contact vendor” or “Chat on WhatsApp” button. Users have to open a product to see “Chat with vendor.”
- **Fix:** If `vendor.whatsapp` is present, add a prominent “Contact vendor” or “Chat on WhatsApp” button in the vendor header card (e.g. next to store name/description), using `https://wa.me/{cleanedNumber}`.

### 2.4 Product images optional / empty array
- **Where:** `ProductDetailClient.tsx`, `ProductCard.tsx`
- **Issue:** Code uses `product.images[0]`. If the API omits `images` or returns `[]`, this is undefined; optional chaining is used in some places but not consistently. Endpoint types show `images?: string[]` in some response shapes.
- **Fix:** Use `product.images?.[0]` (or a shared helper) everywhere product image is read; ensure placeholder (e.g. package icon) when missing.

---

## 3. Consistency & Polish

### 3.1 Cart and Checkout pages: no loading UI
- **Where:** `app/marketplace/cart/page.tsx`, `app/marketplace/checkout/page.tsx`
- **Issue:** Other marketplace routes have `loading.tsx` (e.g. products, vendors, search). Cart and Checkout do not, so during navigation they can show a blank or layout shift.
- **Fix:** Add `app/marketplace/cart/loading.tsx` and `app/marketplace/checkout/loading.tsx` (e.g. simple skeleton or spinner consistent with other marketplace loaders).

### 3.2 Product detail and vendor store pages: layout in page vs client
- **Where:** `app/marketplace/products/[slug]/page.tsx`, `app/marketplace/vendors/[slug]/page.tsx`
- **Issue:** These server pages do not wrap in `MainLayout`; the client components (`ProductDetailClient`, `VendorStorePageClient`) and their skeletons do. That’s consistent and fine; no change required. Noted for clarity.

### 3.3 Marketplace account redirect
- **Where:** `app/marketplace/account/page.tsx`
- **Issue:** Redirects to `/account`. `/account` exists and is correct. The route is redundant but harmless; consider whether `/marketplace/account` should 301 to `/account` or be removed from nav to avoid two “account” entry points.
- **Recommendation:** If “My Account” in marketplace always goes to `/account`, ensure all marketplace links point to `/account` and document that `/marketplace/account` is only for backwards compatibility.

---

## 4. Backend / Types (reference)

- **Cart:** Backend cart endpoints (GET/POST/PATCH/DELETE and clear) and types (`ICartItem`, `ICartRes`) are specified in the plan; ensure `endpoints.ts` and API client are aligned once backend is ready.
- **Vendor WhatsApp:** `PopulatedVendorSummary` and `IMarketplaceVendor` already include `whatsapp?: string`; product list/detail responses should populate it so ProductCard and ProductDetail can show wa.me links.
- **Become vendor:** `MARKETPLACE_BECOME_VENDOR` exists; payload shape (store name, description, contact, bank details) should match backend and be sent on submit.

---

## 5. Summary Table

| Area                     | Severity   | Type   | Action |
|--------------------------|------------|--------|--------|
| Orders use mock data     | Critical   | Logic  | Integrate MARKETPLACE_GET_MY_ORDERS (or equivalent); handle auth. |
| Become vendor no API     | Critical   | Logic  | POST form to MARKETPLACE_BECOME_VENDOR. |
| Cart backend (logged in) | Critical   | Logic  | Implement backend cart when authenticated; optional merge on login. |
| Add to cart when OOS     | High       | Logic  | Disable “Add to cart” when `!product.inStock`. |
| Vendor link (object)     | Medium     | Logic  | Resolve slug when `vendor` is populated object. |
| Search page layout       | High       | UI     | Wrap MarketplaceSearchPageClient in MainLayout. |
| ProductCard WhatsApp     | Medium     | UI     | Use wa.me when product has vendorPopulated.whatsapp. |
| Vendor store contact     | Medium     | UI     | Add “Contact vendor” using vendor.whatsapp. |
| Product images optional  | Low        | UI     | Use images?.[0] and consistent placeholder. |
| Cart/Checkout loading    | Low        | Polish | Add loading.tsx for consistent loading UX. |
| Marketplace account      | Low        | Polish | Prefer linking to /account; treat /marketplace/account as redirect only. |

---

*Audit date: 2025-03-16. Align with `docs/MARKETPLACE-PLAN-CART-AND-VENDOR-UPDATES.md` for cart and vendor WhatsApp behaviour.*
