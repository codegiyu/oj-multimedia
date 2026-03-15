# Public Pages & Endpoints Integration Audit

Audit of **Music**, **Videos**, and **News** pages and their integration with the public API endpoints. Reference: `docs/PUBLIC-PAGES-ENDPOINTS.md`.

---

## Summary

| Area            | Status | Notes |
|-----------------|--------|--------|
| List endpoints   | OK     | All list pages use `callServerApi` with correct keys (`music`, `videos`, `articles`) and query params. |
| Detail endpoints| OK     | Detail pages call item + related, handle 404 via `notFound()`. |
| Error handling  | OK     | List pages set `initialErrorMessage`; clients show `DataLoadError` or inline retry when no content. |
| Empty states    | OK     | Sub-pages use `EmptyState` when list is empty. |
| Mappers         | OK     | `publicApiMappers.ts` aligns API shape with UI types (cover→cover, views→plays, etc.). |

---

## Gaps & Improvements

### 1. **Top Charts: Period change does not refetch** (fixed in code)

- **Issue:** On `/music/top-charts`, the period selector (Weekly / Monthly / All Time) updates the URL via `nuqs` but the page does not refetch. Users still see data for the initial period (e.g. weekly) when switching to monthly or all-time.
- **Fix:** When the user changes period, call `router.refresh()` after updating the query so the server re-runs with new `searchParams.period` and refetches charts for that period.

### 2. **News full-page error icon** (fixed in code)

- **Issue:** `NewsPageClient` uses `<Video />` for the `DataLoadError` icon instead of a news-appropriate icon (e.g. `Newspaper`).
- **Fix:** Use `Newspaper` for the news load error state.

### 3. **Artist / creator slug not used in links**

- **Spec:** Backend may populate `artist` / `creator` with `{ _id, name, slug, image? }`. `PopulatedArtistSummary` in `endpoints.ts` includes `slug`.
- **Current:** `publicApiMappers`’ `toArtistSummary` and `toCreatorSummary` only map `_id` and `name`. Cards and detail pages link to `/music/:id` and `/videos/:id` using `_id` only.
- **Improvement:** Map `slug` when present and use it for detail/profile links (e.g. `/music/[slug]` or `/artist/[slug]`) for SEO and readability. Requires route and link updates.

### 4. **Related stories on news detail ignore category** (fixed in code)

- **Location:** `app/news/story/[id]/page.tsx`
- **Was:** Related articles were fetched with `type=latest` and no `category` filter.
- **Fix:** Related articles request now includes the current article’s category slug (`rawArticle.category`) so “Related” is same-category, consistent with music and video detail pages.

### 5. **Sub-pages “Load more” is client-side only**

- **Current:** Trending / charts / etc. request a single large page (e.g. `limit=50` or `100`) and “Load more” only reveals more of that set. No further API call.
- **Impact:** For very large result sets, the first page is capped; users cannot load true “next page” from the server.
- **Improvement:** Optional: add real pagination (e.g. `page` in `searchParams` or client fetch with `page+1`) when you need to support large lists.

### 6. **Backend response wrapper**

- **Frontend expectation:** `serverApi` + `getDataFromRequest` expect success body: `{ success, message, responseCode, data }` with the payload in `data` (e.g. `data.music`, `data.pagination`). See `lib/utils/general.tsx` and `lib/types/http.ts`.
- **Doc:** `PUBLIC-PAGES-ENDPOINTS.md` describes the payload shape (e.g. `{ music, pagination }`) but does not state that it must be wrapped in a `data` property.
- **Action:** Ensure backend returns the wrapped format, or document it in the endpoint spec so both sides agree.

### 7. **Music main page: no “featured” type from API**

- **Current:** Main music page fetches `type=trending`, `type=charts`, and `type=recent`. “Featured” block uses local `ARTIST_PROFILES` (featured artists), not `type=featured` music from the API.
- **Spec:** GET `/public/music` supports `type=featured`.
- **Improvement:** If you want a “Featured tracks” section from the API, add a fourth request with `type=featured` and wire it into the main music page; otherwise document that featured is artists-only from constants.

### 8. **Detail routes: slug in URL**

- **Spec:** Detail endpoints accept `:idOrSlug` (ObjectId or slug). Frontend detail routes are `[id]` and links use `_id` only.
- **Current:** Using id in URL is fine and works with the spec. No bug.
- **Improvement:** If you add slug to list/detail responses and mappers, you can use `[idOrSlug]` in the route and link with `slug` when available for friendlier URLs.

---

## Consistency check

| Page / area        | List key   | Detail key | Query params (list)                    | Status |
|--------------------|------------|------------|----------------------------------------|--------|
| Music list         | `music`    | `music`    | category, page, limit, status, type, period (charts) | OK |
| Videos list        | `videos`   | `video`    | category, page, limit, status, type    | OK |
| News list          | `articles` | `article`  | category, page, limit, status, type   | OK |

All list/detail keys and query usage match `PUBLIC-PAGES-ENDPOINTS.md`.

---

## Recommendations (priority)

1. **Done:** Top Charts period change triggers refetch (e.g. `router.refresh()` after period change).
2. **Done:** News full-page error icon set to `Newspaper`.
3. **Next:** Related news: use current article’s category when fetching related stories.
4. **Optional:** Add `slug` to artist/creator in mappers and use it in links; optional slug-based detail routes.
5. **Optional:** Document or enforce backend response wrapper `{ success, message, responseCode, data }` in the endpoint spec.
6. **Optional:** Add `type=featured` music section on main music page if product needs it; otherwise document current behavior.
