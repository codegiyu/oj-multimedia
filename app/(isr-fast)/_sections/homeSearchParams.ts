import {
  LEGACY_HOME_MUSIC_GENRE_KEY,
  LEGACY_HOME_VIDEO_CATEGORY_KEY,
  PUBLIC_URL_KEYS,
} from '@/lib/constants/publicUrlKeys';

const legacyGenreLabelToSlug: Record<string, string> = {
  Afrobeats: 'afrobeats',
  'Hip-Hop': 'hiphop',
  Pop: 'pop',
  'R&B': 'rnb',
  Gospel: 'gospel',
  Instrumental: 'instrumental',
};

const legacyVideoLabelToSlug: Record<string, string> = {
  'Music Videos': 'music',
  'Short Clips': 'short',
  Talks: 'talks',
  Dance: 'dance',
  Creative: 'creative',
};

export function resolveHomeMusicCategoryParam(
  musicCategory?: string,
  legacyGenre?: string
): string | undefined {
  if (musicCategory) return musicCategory;
  if (!legacyGenre || legacyGenre.toLowerCase() === 'all') return undefined;
  return legacyGenreLabelToSlug[legacyGenre] ?? legacyGenre.toLowerCase();
}

export function resolveHomeVideoCategoryParam(
  videoCategory?: string,
  legacyCategory?: string
): string | undefined {
  if (videoCategory) return videoCategory;
  if (!legacyCategory || legacyCategory.toLowerCase() === 'all') return undefined;
  return legacyVideoLabelToSlug[legacyCategory] ?? legacyCategory.toLowerCase();
}

export type HomeSearchParamsInput = {
  [PUBLIC_URL_KEYS.MUSIC_CATEGORY]?: string;
  [PUBLIC_URL_KEYS.VIDEO_CATEGORY]?: string;
  [PUBLIC_URL_KEYS.MARKETPLACE_CATEGORY]?: string;
  [LEGACY_HOME_MUSIC_GENRE_KEY]?: string;
  [LEGACY_HOME_VIDEO_CATEGORY_KEY]?: string;
};
