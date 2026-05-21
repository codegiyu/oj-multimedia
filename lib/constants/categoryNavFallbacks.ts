import {
  ALL_CATEGORY_ID,
  MUSIC_CATEGORIES,
  NEWS_CATEGORIES,
  VIDEO_CATEGORIES,
} from '@/lib/constants/contentTaxonomy';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';

function withAll(
  allLabel: string,
  rows: ReadonlyArray<{ id: string; label: string }>
): CategoryNavItem[] {
  return [
    { id: ALL_CATEGORY_ID, label: allLabel },
    ...rows.map(row => ({ id: row.id, label: row.label })),
  ];
}

export const musicCategoryNavFallback = withAll('All Genres', MUSIC_CATEGORIES);
export const videoCategoryNavFallback = withAll('All Videos', VIDEO_CATEGORIES);
export const newsCategoryNavFallback = withAll('All Stories', NEWS_CATEGORIES);
