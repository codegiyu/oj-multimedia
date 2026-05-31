/** Canonical URL query keys for public category filters. */
export const PUBLIC_URL_KEYS = {
  /** Music genre/taxonomy on single-scope pages (`/music/*`). */
  CATEGORY: 'category',
  /** Music charts time window (`weekly` | `monthly` | `alltime`). */
  PERIOD: 'period',
  /** Homepage trending music rail (avoids clash with video rail). */
  MUSIC_CATEGORY: 'musicCategory',
  /** Homepage trending video rail. */
  VIDEO_CATEGORY: 'videoCategory',
  /** Marketplace section on homepage (optional). */
  MARKETPLACE_CATEGORY: 'marketplaceCategory',
  /** Global search content kind. */
  SEARCH_TYPE: 'type',
  SEARCH_QUERY: 'q',
} as const;

/** @deprecated Homepage legacy key — map to MUSIC_CATEGORY when reading searchParams. */
export const LEGACY_HOME_MUSIC_GENRE_KEY = 'genre';

/** @deprecated Homepage legacy key — map to VIDEO_CATEGORY when reading searchParams. */
export const LEGACY_HOME_VIDEO_CATEGORY_KEY = 'category';
