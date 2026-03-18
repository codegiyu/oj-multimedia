# Contact & Search API — Backend Implementation Notes (oj-backend)

This document describes the **implemented** behavior and type/endpoint details the frontend (oj-multimedia) should rely on. Use it to align types and request/response handling with the live backend.

**Base URL for public endpoints:** `{API_BASE}/public`

---

## 1. Contact

### POST `/public/contact`

#### Request body (payload)

| Field    | Type   | Required | Validation                          |
|----------|--------|----------|-------------------------------------|
| `name`   | string | Yes      | max 200                             |
| `phone`  | string | **Yes**  | max 50                              |
| `email`  | string | No       | valid email format if provided, max 320 |
| `subject`| string | Yes      | max 200                             |
| `message`| string | Yes      | min 10, max 5000                    |

**Type for frontend:**

```ts
export interface SubmitContactPayload {
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
}
```

#### Response (201)

`data` always includes:

- **`message`**: e.g. `"Thank you for your message. We'll get back to you soon."`
- **`contactSubmission`**: object with `_id` and `createdAt` (backend persists every submission).

**Type for frontend:**

```ts
export interface SubmitContactRes {
  message: string;
  contactSubmission: {
    _id: string;
    createdAt: string;  // ISO date
  };
}
```

#### ContactSubmission (persisted document type)

The backend stores each submission with the following shape. The API response only returns `_id` and `createdAt`; the full type is provided for reference (e.g. if the backend later exposes an admin endpoint that returns full documents).

```ts
/** Full ContactSubmission document (backend model). Response only returns _id + createdAt. */
export interface ContactSubmission {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  createdAt: string;  // ISO date
  updatedAt: string;  // ISO date
}
```

**Frontend:** Use `SubmitContactPayload` for the request body and `SubmitContactRes` for the 201 response. `contactSubmission` is always present on success.

---

## 2. Search

### GET `/public/search`

- **Query params:** `q` (optional; empty/missing returns empty results), `type`, `page`, `limit`.  
  Defaults: `page=1`, `limit=24`; `limit` is clamped to a max of 50. Invalid numeric values fall back to these defaults.
- **`type` values:** Omit or empty = all types. Single type: `music`, `news`, `video`, `devotional`, `testimony`, `prayer-request`, `question`, `poll`, `resource`, `artist`. Special value `community` = all community types (devotional, testimony, prayer-request, question, poll, resource, artist).

**Response `data`:**

- `results`: array of `SearchResultItem`.
- `pagination`: `{ page, limit, total, totalPages }`.

**Search result items:**

- `_id`: **Plain document ID string** (no prefix). Use this with `type` to build detail URLs, e.g. `/music/:id`, `/community/devotionals/:id`, `/news/:id`.
- `title`, `subtitle`, `type`, `image?`, `meta` as in the shared API contract.

**Frontend:** Use `result.type` to choose the route segment; use `result._id` as the `:id` param. Do not rely on any prefix in `_id`; the backend returns the raw document id.

---

## 3. Path summary

| Method | Path | Description |
|--------|------|-------------|
| POST | `/public/contact` | Submit contact form (body: name, **phone**, email?, subject, message) |
| GET | `/public/search?q=...&type=...&page=...&limit=...` | Unified search |

Contact page data (contact info, socials) continues to come from the existing **site-settings** endpoints (e.g. `/site-settings/contactInfo`, `/site-settings/socials`), not from these public routes.

---

## 4. Summary of contact payload and response changes

- **Payload:** `phone` is **required**; `email` is **optional**. All other fields (`name`, `subject`, `message`) remain required.
- **Response:** `data.contactSubmission` is always present on 201 and includes `_id` and `createdAt` (ISO string).
- **ContactSubmission type:** Document includes `name`, `phone`, optional `email`, `subject`, `message`, and timestamps; the public API only returns `_id` and `createdAt` in the response.
