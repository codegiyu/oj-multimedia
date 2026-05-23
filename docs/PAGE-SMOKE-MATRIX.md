# Page smoke matrix (Phase 5)

Manual sign-off checklist for the routes-and-pages audit. Run after Phases 1–4 are deployed or on a local stack with **oj-backend** and **oj-multimedia** running.

**Automated coverage:** `npm run test:e2e:smoke` (starts Next dev server; browser tests). Contract-only: `npm run test:e2e` (includes download URL tests without a server).

**First-time setup:** run `npx playwright install chromium` in `oj-multimedia` before browser smoke tests.

**Legend:** `[ ]` not checked · `[x]` passed · `[!]` failed (note in Comments)

---

## Public — hubs and content

| Route | Expect | Auto e2e | Manual |
|-------|--------|----------|--------|
| `/` | 200, home sections or skeleton | yes | [ ] |
| `/music` | 200, list or empty state | yes | [ ] |
| `/music/trending` | 200 | yes | [ ] |
| `/music/top-charts` | 200; period change refetches | yes | [ ] |
| `/music/[id]` | 200 or 404 for bad id | — | [ ] |
| `/videos` | 200 | yes | [ ] |
| `/videos/trending` | 200 | yes | [ ] |
| `/videos/[id]` | 200 or 404 | — | [ ] |
| `/news` | 200 | yes | [ ] |
| `/news/trending` | 200 | yes | [ ] |
| `/news/story/[id]` | 200 or 404 | — | [ ] |
| `/search` | 200, query in URL | yes | [ ] |
| `/contact` | 200, form renders | yes | [ ] |
| `/privacy-policy` | 200 | yes | [ ] |

**Phase 1 — downloads:** On a published free track/video detail page, download uses `/api/v1/public/.../download` (network tab). Analytics POST hits `/api/v1/public/analytics/content-event`.

---

## Marketplace

| Route | Expect | Auto e2e | Manual |
|-------|--------|----------|--------|
| `/marketplace` | 200 | yes | [ ] |
| `/marketplace/products` | 200 | yes | [ ] |
| `/marketplace/products/[slug]` | 200 product or “Product not found” | yes (missing slug) | [ ] |
| `/marketplace/vendors` | 200 | yes | [ ] |
| Cart / checkout | Authenticated flow | — | [ ] |

---

## Community (Phase 2 API)

| Route | Expect | Auto e2e | Manual |
|-------|--------|----------|--------|
| `/community` | 200 | yes | [ ] |
| `/community/devotionals/popular` | 200, API data or retry UI | yes | [ ] |
| `/community/devotionals/bible-study` | 200 | yes | [ ] |
| `/community/testimonies/latest` | 200 | yes | [ ] |
| `/community/testimonies/featured` | 200 | yes | [ ] |
| `/community/testimonies/[id]` | 200 or 404 | yes (404) | [ ] |
| `/community/prayer-requests/active` | 200 | yes | [ ] |
| `/community/prayer-requests/answered` | 200 | yes | [ ] |
| `/community/prayer-requests/[id]` | 200 or 404 | yes (404) | [ ] |
| `/community/ask-a-pastor/active` | 200 | yes | [ ] |
| `/community/ask-a-pastor/answered` | 200 | yes | [ ] |
| `/community/ask-a-pastor/[id]` | 200 or 404 | yes (404) | [ ] |

---

## Client auth and account

| Route | Expect | Auto e2e | Manual |
|-------|--------|----------|--------|
| `/auth/login` | 200, Google CTA | yes | [ ] |
| `/account` | Redirect to login if guest | yes | [ ] |
| `/account/artist-portal` | Redirect if guest | yes | [ ] |
| `/account/artist-portal/music` | List; no delete (Phase 4) | yes redirect | [ ] |
| `/account/artist-portal/videos` | List; no delete | — | [ ] |
| `/account/artist-portal/upload` | WhatsApp / upload copy | — | [ ] |
| `/account/vendor/*` | Vendor hub when logged in | yes redirect | [ ] |

---

## Admin

| Route | Expect | Auto e2e | Manual |
|-------|--------|----------|--------|
| `/admin/auth/login` | 200 | yes | [ ] |
| `/admin/auth/accept-invite/create-password` | Invite copy, email + scopeToken | yes | [ ] |
| `/admin/dashboard/*` (lists) | Guest → login; authed → table, no `listError` | partial | [ ] |
| `/admin/dashboard/gospel-verses` | List loads (Phase 3 API) | yes redirect | [ ] |
| `/admin/dashboard/ask-a-pastor` | List, assign/answer actions | yes redirect | [ ] |

**Deferred:** Notifications / newsletter admin (no API).

---

## Sign-off

| Role | Date | Notes |
|------|------|-------|
| Dev | | |
| QA / Product | | |

**Commands**

```bash
# oj-multimedia — contract + skipped browser tests (no server)
npm run test:e2e

# oj-multimedia — full smoke (starts dev server)
npm run test:e2e:smoke

# oj-backend — regression
npm run test:integration
```
