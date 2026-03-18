# Marketplace Plan Updates: Cart (Required) and Vendor Population (WhatsApp)

This document updates the marketplace implementation plan with:

1. **Cart is required** — full backend endpoints and UI; not optional.
2. **Vendor population on product** must include `whatsapp`; the WhatsApp link is generated from that number.

---

## 1. Cart — Required

### Backend documentation (oj-backend)

Document the following **cart endpoints** in the marketplace/public API doc. Cart is persisted per user (authenticated); guest cart may remain client-only and merge on login, or backend may support session-based cart — document the chosen model.

- **GET /user/cart**  
  - **Auth:** Required (user).  
  - **Query:** None or optional `?fields=...`.  
  - **Response:**  
    - `items`: array of cart items.  
    - Each item: `productId`, `product` (populated summary: _id, name, slug, image, price, vendor slug/name if needed), `quantity`, `sku?` (if product has variants).  
    - Optional: `totalItems`, `subtotal` for convenience.  
  - **Populations:** Product summary for display (and vendor slug/name for “Chat with vendor” link).

- **POST /user/cart** (add or update item)  
  - **Auth:** Required.  
  - **Body:** `{ productId: string; quantity: number; sku?: string }`.  
  - **Response:** Updated cart (same shape as GET) or `{ item: CartItem }` and updated cart.  
  - **Behaviour:** If item exists, update quantity (and sku if provided); otherwise add. Validate product exists and is purchasable.

- **PATCH /user/cart** (update quantity or bulk update)  
  - **Auth:** Required.  
  - **Body:** `{ updates: Array<{ productId: string; quantity: number }> }` or single `{ productId, quantity }`.  
  - **Response:** Updated cart.  
  - **Behaviour:** Set quantity; if quantity &lt; 1, remove item.

- **DELETE /user/cart/:productId** (remove item)  
  - **Auth:** Required.  
  - **Response:** `{ success: boolean }` or updated cart.

- **DELETE /user/cart** (clear cart)  
  - **Auth:** Required.  
  - **Response:** `{ success: boolean }` or empty cart.

Define a **CartItem** type (and Cart response type) in the backend doc so the frontend can align.

### endpoints.ts (oj-multimedia)

Add and maintain the following (or equivalent names):

- **USER_CART_GET** — `GET /user/cart`, response: `{ items: ICartItem[]; pagination?: ... }` or `ICartRes`.
- **USER_CART_ADD** — `POST /user/cart`, payload: `{ productId: string; quantity: number; sku?: string }`, response: cart or `{ item: ICartItem }`.
- **USER_CART_UPDATE** — `PATCH /user/cart`, payload: `{ productId: string; quantity: number }` or `{ updates: Array<...> }`, response: cart.
- **USER_CART_REMOVE** — `DELETE /user/cart/:productId`, path param `productId`, response: `{ success: boolean }` or cart.
- **USER_CART_CLEAR** — `DELETE /user/cart`, response: `{ success: boolean }` or empty cart.

Define **ICartItem** with at least: `productId`, `quantity`, `sku?`, and populated `product` (summary with _id, name, slug, image, price, vendorSlug, vendorName, and optionally vendor whatsapp if needed for “Chat”). **ICartRes** (or equivalent): `{ items: ICartItem[] }` and optional totals.

### UI

- Cart UI (drawer, page, or both) must display cart from **backend** when the user is logged in (fetch on load, after add/remove/update).
- When user is not logged in, keep existing client-side cart (zustand) and show it; on login, optionally merge with backend cart (e.g. POST each local item to backend, then clear local).
- Checkout builds the order payload from the **current cart** (backend cart if logged in, else client cart).

---

## 2. Vendor population and WhatsApp

### Backend documentation (oj-backend)

- In the **product** section (list products, get product by slug, etc.), state that when **vendor** is populated on a product, the populated vendor object **must include**:
  - `_id`, `name`, `slug`, `storeName` (or equivalent).
  - **`whatsapp`** (string, optional): the vendor’s WhatsApp number (e.g. E.164 or national format). Used to generate a “Chat with vendor” or “Contact vendor” link.

- **WhatsApp link:** The frontend (or backend when returning a pre-built link) generates the link from the vendor’s `whatsapp` number, e.g. `https://wa.me/{number}?text={encodedMessage}`. No need for a separate “vendor contact link” endpoint if the number is present; document that the number is in vendor data and the link is derived from it.

### endpoints.ts (oj-multimedia)

- **PopulatedVendorSummary** (and any product-side vendor type used for populated vendor): add **`whatsapp?: string`** so that product list/detail responses can expose the vendor’s WhatsApp number and the UI can build the link.
- **IMarketplaceProduct:** If the API returns a populated `vendor` object (in addition to or instead of `vendorName`/`vendorSlug`), type it so that it includes `whatsapp?: string` (e.g. use a type that extends or matches PopulatedVendorSummary with whatsapp).

### UI

- Where “Chat with vendor” or “Contact vendor” is shown (product card, product detail, vendor store), use the populated vendor’s **whatsapp** to build the link: `https://wa.me/{cleanedNumber}?text={optionalPreFill}`. If `whatsapp` is missing, hide the button or show a different contact method.

---

## 3. Summary

| Area | Backend doc | endpoints.ts | UI |
|------|-------------|-------------|-----|
| **Cart** | Required: GET/POST/PATCH/DELETE cart and clear; CartItem and cart response types; auth required. | Add USER_CART_GET, USER_CART_ADD, USER_CART_UPDATE, USER_CART_REMOVE, USER_CART_CLEAR and ICartItem/ICartRes. | Cart displayed from backend when logged in; merge or replace client cart on login; checkout uses current cart. |
| **Vendor on product** | Populated vendor must include `whatsapp`; link is generated from this number. | Add `whatsapp?: string` to PopulatedVendorSummary (and product vendor type). | Build wa.me link from vendor.whatsapp where needed. |

These updates should be reflected in the main marketplace backend documentation file and in `lib/constants/endpoints.ts` during implementation.
