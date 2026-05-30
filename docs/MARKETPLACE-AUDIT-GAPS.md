# Marketplace Pages — Audit Status

Last updated: 2026-05-30. Tracks resolved and remaining marketplace gaps after the full remediation batch.

---

## Resolved (Phases 1–5)

### Vendor onboarding
- Become-vendor form submits to `POST /api/v1/marketplace/become-vendor` with auth
- `User.vendorId` set atomically on apply; login gate on public page
- Form uses Zod + `useForm`, `RegularTextarea`, grid spacing

### Public marketplace
- Homepage product rail links use **slug** (not `_id`)
- Vendor store pages filter products by vendor slug
- Paginated vendor listing API
- `vendorWhatsapp` resolved consistently in product cards/detail
- Variant products: add-to-cart disabled on cards (link to detail)

### Vendor portal & admin
- Pending / suspended / inactive vendors blocked from dashboard mutations (403)
- Pending-approval banner in vendor portal
- Admin approve auto-links applicant user; reject uses `inactive` (re-approve supported)
- Admin toasts on approve/reject failure; drawer shows approval/rejection metadata

### Cart & checkout
- Backend cart increment semantics; variant pricing in sync
- Guest cart merge on login
- Checkout syncs backend cart before place order
- Stock validation on cart add and checkout

### Orders & purchase
- Server-side price validation for all products (anti-tampering)
- Order `notes` persisted
- Vendor + admin PATCH order status / paymentStatus
- WhatsApp links on order history; guest order success shows order numbers
- `/marketplace/orders` redirects to `/account/orders`
- Offline / WhatsApp-assisted checkout (no payment gateway)

---

## Out of scope (by design)

- Online payment gateway (Paystack, Stripe)
- Numeric inventory (boolean `inStock` only)
- Email/SMS notifications on order status change (future)

---

## Minor follow-ups (optional)

- `/marketplace/account` remains a backwards-compat redirect to `/account`
- `?chat=1` on vendor store is still a no-op (direct WhatsApp links used elsewhere)
- Legacy `getMockOrders` helpers in `lib/utils/marketplace.ts` (unused in live UI)

---

## Test coverage

- Backend: unit tests for vendor access, product shape, cart/order helpers; integration tests for become-vendor auth
- Frontend: vendor application schema, cart store; e2e smoke for marketplace routes
- Run phase tests before release: `npm run test:phase:unit` (both repos)
