export interface ContentCategoryOption {
  id: string;
  label: string;
}

export const ALL_CATEGORY_ID = 'all';

/** Canonical video content category slugs (matches VIDEO_CATEGORIES ids). */
export const VIDEO_CATEGORY_SLUGS = [
  'music',
  'short',
  'talks',
  'creative',
  'inspirational',
  'live',
  'podcasts',
  'sermon',
  'movies',
  'drama',
] as const;

export type VideoCategorySlug = (typeof VIDEO_CATEGORY_SLUGS)[number];

export const NEWS_CATEGORIES: ReadonlyArray<ContentCategoryOption> = [
  { id: 'christian-celebrity-news', label: 'Christian Celebrity News' },
  { id: 'church-announcements', label: 'Church & Ministry Announcements' },
  { id: 'inspirational-stories', label: 'Inspirational Stories' },
  { id: 'scholarship-alerts', label: 'Scholarship Alerts' },
  { id: 'jobs-ngo', label: 'Jobs (NGO / Faith-based)' },
  { id: 'christian-movie-reviews', label: 'Christian Movie Reviews' },
];

export const VIDEO_CATEGORIES: ReadonlyArray<ContentCategoryOption & { id: VideoCategorySlug }> = [
  { id: 'music', label: 'Music Videos' },
  { id: 'short', label: 'Short Clips' },
  { id: 'talks', label: 'Talks & Speeches' },
  { id: 'creative', label: 'Creative Content' },
  { id: 'inspirational', label: 'Inspirational' },
  { id: 'live', label: 'Live Performances' },
  { id: 'podcasts', label: 'Podcasts / Video Talks' },
  { id: 'sermon', label: 'Sermons' },
  { id: 'movies', label: 'Movies' },
  { id: 'drama', label: 'Drama' },
];

/** Legacy API slugs → display label when not in VIDEO_CATEGORIES. */
const VIDEO_CATEGORY_LEGACY_LABELS: Record<string, string> = {
  movie: 'Movies',
  'movies-long-form': 'Movies',
};

export function isVideoCategorySlug(value: string): value is VideoCategorySlug {
  return (VIDEO_CATEGORY_SLUGS as readonly string[]).includes(value);
}

/** Map API/legacy slugs to a canonical VideoCategorySlug (e.g. movie → movies). */
export function normalizeVideoCategorySlug(value: string | null | undefined): VideoCategorySlug {
  if (value === 'movie') return 'movies';
  if (value && isVideoCategorySlug(value)) return value;

  return 'creative';
}

export function getVideoCategoryLabel(categorySlug: string | null | undefined): string {
  if (!categorySlug) {
    return VIDEO_CATEGORIES.find(option => option.id === 'creative')?.label ?? 'Creative Content';
  }

  const match = VIDEO_CATEGORIES.find(option => option.id === categorySlug);
  if (match) return match.label;

  return VIDEO_CATEGORY_LEGACY_LABELS[categorySlug] ?? categorySlug;
}

export const MUSIC_CATEGORIES: ReadonlyArray<ContentCategoryOption> = [
  { id: 'afrobeats', label: 'Afrobeats' },
  { id: 'hiphop', label: 'Hip-Hop' },
  { id: 'pop', label: 'Pop' },
  { id: 'rnb', label: 'R&B' },
  { id: 'gospel', label: 'Gospel' },
  { id: 'instrumental', label: 'Instrumental' },
  { id: 'acoustic', label: 'Acoustic' },
  { id: 'worship', label: 'Worship' },
  { id: 'spoken', label: 'Spoken Word' },
  { id: 'sermon', label: 'Sermon' },
];

export const NEWS_TYPE_VALUES = ['featured', 'latest', 'trending', 'video', 'breaking'] as const;
export const VIDEO_TYPE_VALUES = [
  'trending',
  'featured',
  'recent',
  'short-form',
  'long-form',
] as const;
export const MUSIC_TYPE_VALUES = ['trending', 'charts', 'recent'] as const;
export const CHART_PERIOD_VALUES = ['weekly', 'monthly', 'alltime'] as const;

export const NEWS_TYPES = {
  featured: 'featured',
  latest: 'latest',
  trending: 'trending',
  video: 'video',
  breaking: 'breaking',
} as const;

export const VIDEO_TYPES = {
  trending: 'trending',
  featured: 'featured',
  recent: 'recent',
  shortForm: 'short-form',
  longForm: 'long-form',
} as const;

export const MUSIC_TYPES = {
  trending: 'trending',
  charts: 'charts',
  recent: 'recent',
} as const;

export function normalizeCategoryId(
  value: string | null | undefined,
  options: ReadonlyArray<ContentCategoryOption>
): string {
  if (!value || value === ALL_CATEGORY_ID) return ALL_CATEGORY_ID;
  return options.some(option => option.id === value) ? value : ALL_CATEGORY_ID;
}

export function mapCategoryIdToLabel(
  value: string | null | undefined,
  options: ReadonlyArray<ContentCategoryOption>
): string | null {
  const categoryId = normalizeCategoryId(value, options);
  if (categoryId === ALL_CATEGORY_ID) return null;
  const match = options.find(option => option.id === categoryId);
  return match?.label ?? null;
}
