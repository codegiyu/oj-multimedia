# Album entity — delivery phases

Phases 4–7 (images, admin modals, backend, admin dashboard) are **done**. Remaining work is split so Phase 8 stays focused on **public discovery**, while cross-cutting integration and out-of-scope items have explicit homes.

## Completed

| Phase | Scope | Repo |
|-------|--------|------|
| 4 | Broken URL recovery (`FillImage` onError → fallback) | oj-multimedia |
| 5 | Image upload on six admin modals | oj-multimedia |
| 6 | Album model, APIs, `Music.album` ref, search (backend) | oj-backend (+ minimal types) |
| 7 | Admin albums dashboard (list, drawer, modal, nav) | oj-multimedia |
| 8 | Public albums (list, detail, search, artist profile) | oj-multimedia |
| 9 | Admin music ↔ album linking (picker, table, drawer) | oj-multimedia (+ admin music album populate) |
| 10 | Public music album surfacing (API shaping, detail breadcrumb, card label) | oj-multimedia + oj-backend |

## Phase 8 — Public albums (done)

**Goal:** Visitors can browse and open published albums; albums appear on the music hub, search, and artist profiles.

- Public API client: `PUBLIC_GET_ALBUMS`, `PUBLIC_GET_ALBUM_ITEM`
- Mappers: `mapPublicAlbumToCard`, track → music card props
- Routes: `/music/albums`, `/music/albums/[idOrSlug]`
- UI: `AlbumCard`, `FeaturedAlbums`, list + detail pages
- Search: `album` result type, routes, filter tab
- Artist profile: albums grid (`?artist=`)

**Not in Phase 8:** artist portal submission, admin music album picker.

## Phase 9 — Admin ↔ music linking (done)

**Goal:** Admins can attach tracks to albums without raw IDs.

- `CreateMusicModal`: album select (published albums for same artist)
- Admin music table/drawer show linked album title

**Risks:** Artist mismatch — backend already validates; UI filters albums by resolved artist.

## Phase 10 — Public music ↔ album surfacing (done)

**Goal:** Track pages and lists expose album context when `Music.album` is set.

- Backend: include `album` (id, title, slug) on `shapeMusicListItem` / `shapeMusicDetail` (published albums only)
- Frontend: breadcrumb / link on music detail; album label on `MusicCard`

## Phase 11 — Artist-submitted albums (out of scope)

**Not building:** artist portal album CRUD, approval queue, or self-service upload flows.

**Operational workflow:** Artists may request an album via **WhatsApp** (or other offline channel). Admin creates the album in **Dashboard → Albums**, assigns ownership to the artist’s user account, then links tracks from **Music** (Phase 9).

Document this in admin-facing help/runbook when needed.

## Phase 12 — Release & observability (current)

- E2E: `/music/albums`, album detail, search hit → detail
- Smoke routes already include `/admin/dashboard/albums`
- Optional: content analytics events for album view (if product wants parity with music)

## Risk register (carried forward)

| Risk | Mitigation | Phase |
|------|------------|-------|
| Album without tracks looks empty | Detail copy + admin note to link tracks | 8, 9 |
| Search `type=music` hides albums | Dedicated album filter tab; “all” includes albums | 8 |
| Broken cover URLs | `FillImage` + `imageContext="public"` | 4 (done) |
| Artist/album mismatch on assign | Backend validation; filtered picker | 9 |
| Duplicate slug per artist | Unique index `{ slug, artist }` | 6 (done) |
