export interface ContentCategoryOption {
  id: string;
  label: string;
}

export const ALL_CATEGORY_ID = 'all';

export const NEWS_CATEGORIES: ReadonlyArray<ContentCategoryOption> = [
  { id: 'christian-celebrity-news', label: 'Christian Celebrity News' },
  { id: 'church-announcements', label: 'Church & Ministry Announcements' },
  { id: 'inspirational-stories', label: 'Inspirational Stories' },
  { id: 'scholarship-alerts', label: 'Scholarship Alerts' },
  { id: 'jobs-ngo', label: 'Jobs (NGO / Faith-based)' },
  { id: 'christian-movie-reviews', label: 'Christian Movie Reviews' },
];

export const VIDEO_CATEGORIES: ReadonlyArray<ContentCategoryOption> = [
  { id: 'music', label: 'Music Videos' },
  { id: 'short', label: 'Short Clips' },
  { id: 'talks', label: 'Talks & Speeches' },
  { id: 'creative', label: 'Creative Content' },
  { id: 'inspirational', label: 'Inspirational' },
  { id: 'live', label: 'Live Performances' },
  { id: 'podcasts', label: 'Podcasts / Video Talks' },
  { id: 'sermon', label: 'Sermons' },
];

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

export const NEWS_TYPE_VALUES = ['featured', 'latest', 'trending', 'video'] as const;
export const VIDEO_TYPE_VALUES = ['trending', 'featured', 'recent', 'short-form'] as const;
export const MUSIC_TYPE_VALUES = ['trending', 'charts', 'recent'] as const;
export const CHART_PERIOD_VALUES = ['weekly', 'monthly', 'alltime'] as const;

export const NEWS_TYPES = {
  featured: 'featured',
  latest: 'latest',
  trending: 'trending',
  video: 'video',
} as const;

export const VIDEO_TYPES = {
  trending: 'trending',
  featured: 'featured',
  recent: 'recent',
  shortForm: 'short-form',
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
