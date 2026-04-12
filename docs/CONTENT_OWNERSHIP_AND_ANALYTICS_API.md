# Content ownership and analytics — backend contract

This document specifies API behavior for the **oj-multimedia** backend (separate service). The Next.js app types and calls these routes via `lib/constants/endpoints.ts`.

## 1. Linking content to a user account

### Canonical model

- Music, video, and (optionally) devotionals store **`artist`** (ObjectId ref to `Artist`).
- **`User.artistId`** links a user to their artist profile. Treat “user is an artist” as **`artistId` is set** (and optional `artist` role slug if your auth model uses it).

### Admin create (music, video, devotional)

Payload may include:

- **`artistId`** (optional): attach to an existing artist profile.
- **`ownerUserId`** (optional): attach via user account. Server MUST:
  1. If `user.artistId` exists, set content `artist` to that artist.
  2. Else create or attach an `Artist` with `user` = `ownerUserId`, set `user.artistId`, then set content `artist`.
- If **both** are sent, **`ownerUserId` takes precedence** for resolving `artist` (document this in API errors if you reject both instead).

Neither field is required if platform allows unattributed content.

### Admin update (PATCH)

- **`ownerUserId`** or **`artistId`** may be accepted **only when** `artist` is currently **unset**.
- After `artist` is set, any attempt to change it returns **409** (or **400**) with a clear message.
- List/detail responses SHOULD include **`ownerLocked: true`** when `artist` is set so the UI can disable owner controls.

### Admin user search

`GET /admin/users?search=&limit=20` (admin auth required)

Response `data`:

```json
{
  "users": [
    {
      "_id": "...",
      "email": "...",
      "firstName": "...",
      "lastName": "...",
      "artistId": "..."
    }
  ]
}
```

## 2. Analytics

### Metrics

- **`views`**: detail impression (e.g. once per session per client; debounce/idempotency).
- **`plays`**: playback started (audio/video).
- **`downloads`**: download intent (see music redirect below).

Store per document with **`$inc`**. Optionally maintain **`Artist`-level aggregates** or `artist_analytics` for fast dashboard reads (Redis TTL optional).

### Public event (preferred)

`POST /public/analytics/content-event` (no auth; **rate limit**)

Body:

```json
{
  "entityType": "music | video | devotional | news-article",
  "entityIdOrSlug": "string",
  "event": "view | play | download",
  "clientSessionId": "optional stable id from client"
}
```

Optional header: **`Idempotency-Key`** for deduplication (e.g. React Strict Mode double effects).

Response: `{ "ok": true }` minimal JSON; **no CDN caching**.

### Music download

Keep `GET /public/music/:idOrSlug/download` as incrementing **`downloads`** and redirecting, OR also accept `download` events—pick one source of truth and document.

### Video download (parity)

`GET /public/videos/:idOrSlug/download` — same pattern as music for tracked downloads.

## 3. Dashboard aggregates

### Artist (logged-in artist)

`GET /artist/dashboard-stats` — extend with e.g.:

- `totalViews`, `totalPlays`, `totalDownloads`
- Optional breakdown: `music: { views, plays, downloads }`, `video: { … }`, `devotionals: { views, plays }`
- Optional real hints: `tracksAddedThisMonth`, `playsDeltaPercent` (else frontend uses neutral copy)

### Admin artist overview

`GET /admin/artists/:artistId/dashboard-stats` (admin auth) — same aggregate shape as above, plus optional **`topMusic`**, **`topVideos`** arrays for support UI.

## 4. Response fields on content items

Music/video list and detail items SHOULD expose: **`views`**, **`plays`** (music/video), **`downloads`** where applicable, **`artist`**, **`ownerLocked`**, optional **`ownerUserId`**.

Devotionals: optional **`artist`**, **`plays`**, **`views`**, **`ownerLocked`** when linked.

## 5. Artist self-service: create profile

Authenticated users without an artist record use the Next.js “Become an artist” flow. The app calls:

### `POST /artist/me`

- **Auth:** Same session/JWT as other `/artist/*` routes.
- **Body (JSON):**
  - **`name`** (string, required) — public artist name; server should derive **`slug`** (unique).
  - Optional: **`bio`**, **`image`**, **`coverImage`**, **`genre`**, **`socials`** — same fields as `PATCH /artist/me` / artist model.

**Behavior:**

1. Resolve the authenticated user.
2. If **`user.artistId`** is already set (or an artist row exists for this user), respond **`409 Conflict`** with a clear message (client may tell the user to refresh).
3. Otherwise create an **`Artist`** document with **`user`** = current user id, set defaults (**`isActive`**, **`isFeatured`**, **`displayOrder`** per product rules), set **`user.artistId`**, and return the same **`data`** shape as **`GET /artist/me`**: `{ "artist": { … } }` (standard success envelope).

**Errors:** **`401`** if unauthenticated; **`409`** if profile already exists; **`400`** for validation (e.g. missing `name`, invalid slug collision after retry).
