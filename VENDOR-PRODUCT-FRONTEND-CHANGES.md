# Vendor Dashboard: Product Create & Update – Expected Frontend Changes

This document describes the frontend changes required in the vendor dashboard so that product creation and editing align with the current backend API (product variations, `inStock` instead of `stockQuantity`, and related types).

---

## 1. Backend contract (summary)

- **Stock:** Products use **`inStock`** (boolean) only. **`stockQuantity`** is no longer used; transactions are handled off-platform.
- **Simple products:** Send `name`, `price`, `images`, optional `inStock` (default `true`), plus existing fields (description, category, subCategory, tags, isFeatured).
- **Products with variations:** Optionally send **`variationOptions`** and **`variants`**. The backend requires one variant per combination of option values, exactly one variant with **`isDefault: true`** (or it sets the first variant as default), and generates **SKU** in uppercase when missing.

Types and payloads are defined in **`lib/constants/endpoints.ts`**: `IVendorCreateProductPayload`, `IVendorUpdateProductPayload`, `IMarketplaceProduct`, `IMarketplaceVariationOption`, `IMarketplaceProductVariant`.

---

## 2. Create product (VendorNewProductPageClient)

### 2.1 Remove stockQuantity, add inStock

- **Remove** from schema and form:
  - `stockQuantity` (number)
- **Add** (or keep if already present):
  - **`inStock`** (boolean), default `true`.  
  - Optional: a single checkbox “In stock” that maps to `inStock`.

**Payload:** When calling the create-product API, send `inStock` (e.g. `true`/`false`) and do **not** send `stockQuantity`.

### 2.2 Optional: product variations

To support products with options (e.g. Colour, Size) and different prices/availability per combination:

- **Variation options:** Array of `{ name: string; values: string[] }`, e.g.  
  `[ { name: "Colour", values: ["Red", "Blue"] }, { name: "Size", values: ["S", "M", "L"] } ]`.
- **Variants:** One entry per combination of option values. Each variant has:
  - **`options`:** `Record<string, string>` (e.g. `{ Colour: "Red", Size: "M" }`).
  - **`price`:** number (can differ per variant).
  - **`inStock`:** boolean.
  - **`isDefault`:** boolean. Exactly one variant must be `true`; backend will correct if none or multiple are set.
  - **`sku`:** optional string (backend will generate uppercase SKU if omitted).
  - **`image`:** optional string (variant-specific image URL).

**Backend rules the frontend should respect (or rely on backend to enforce):**

- Every combination of `variationOptions` must have exactly one variant (Cartesian product).
- Exactly one variant must have `isDefault: true`. If the user does not choose a default, the frontend can set the first variant as default before submit.

**Suggested UX:**

- Toggle or checkbox: “This product has variations (e.g. size, colour)”.
- If enabled:
  - Section to add variation options (name + list of values).
  - Section to edit variants (either generated from options with editable price/inStock/sku/image per row, or a table of combinations).
  - One “Default” radio or similar so exactly one variant is marked `isDefault: true`.
- If disabled: keep current single price + single `inStock` and send no `variationOptions`/`variants`.

**Payload:** For create, send `variationOptions` and `variants` only when the product has variations; otherwise omit them. Always send top-level `price` (e.g. minimum variant price or the single price for simple products) and `inStock` (for simple products; for variant products the backend derives it from variants).

---

## 3. Update product (VendorEditProductPageClient)

### 3.1 Same field changes as create

- **Remove** `stockQuantity` from schema and form.
- **Add** (or keep) **`inStock`** for simple products.
- When loading a product that has **`variationOptions`** and **`variants`**, show them in the form and allow editing (add/remove options, edit variant price/inStock/sku/image, set default).
- On submit, send **`IVendorUpdateProductPayload`**: same shape as create for `variationOptions` and `variants`; all fields optional for PATCH.

### 3.2 Pre-fill and validation

- Map API product to form state: `inStock` from `product.inStock`; if `product.variants` exists, pre-fill options and variants (including `isDefault`).
- Before submit, either:
  - Validate “one variant per combination” and “exactly one isDefault” and show errors, or
  - Rely on the backend to return 400 with a clear message and surface it to the user.

---

## 4. Product list (VendorProductsPageClient)

- **Remove** display of **`stockQuantity`** (e.g. “Stock: 10”).
- **Show** **`inStock`** (e.g. “In stock” / “Out of stock” badge or text).
- If the product has **`variants`**:
  - Optionally show “X variants” or “From £X” using the base `price` or the minimum variant price.
  - Optionally show “In stock” only when at least one variant has `inStock === true` (this matches backend-derived product `inStock`).

---

## 5. Types reference (endpoints.ts)

- **Create payload:** `IVendorCreateProductPayload`  
  - `inStock?`, `variationOptions?`, `variants?` (no `stockQuantity`).
- **Update payload:** `IVendorUpdateProductPayload`  
  - Same; all fields optional.
- **Product response:** `IMarketplaceProduct`  
  - `inStock`, `variationOptions?`, `variants?` (no `stockQuantity`).
- **Variant type:** `IMarketplaceProductVariant`  
  - `options`, `price`, `inStock`, `isDefault`, `sku?`, `image?`.
- **Variation option type:** `IMarketplaceVariationOption`  
  - `name`, `values` (string array).

---

## 6. Checklist

| Area | Change |
|------|--------|
| Create product form | Remove `stockQuantity`; add `inStock`. Optionally add variation options + variants + default. |
| Update product form | Same as create; pre-fill `inStock` and, if present, `variationOptions` and `variants`. |
| Create/update payload | Send `inStock`; do not send `stockQuantity`. Send `variationOptions` and `variants` only when product has variations. |
| Product list | Show `inStock` instead of `stockQuantity`; optionally show variant count or “From £X” for variable products. |
| Validation | Ensure exactly one variant has `isDefault: true` when variations exist; optionally validate full combination coverage before submit. |

Once these changes are in place, the vendor dashboard will be aligned with the backend product and variant model and ready for products with and without variations.
