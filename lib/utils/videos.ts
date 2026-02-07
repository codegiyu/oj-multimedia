import { VIDEOS_ITEMS, type VideoItem } from '@/lib/constants/videos';

/** Video category to display label for home section */
function videoCategoryToLabel(category: VideoItem['category']): string {
  const map: Record<VideoItem['category'], string> = {
    music: 'Music Videos',
    short: 'Short Clips',
    talks: 'Talks',
    creative: 'Creative',
    inspirational: 'Inspirational',
    live: 'Live Performances',
    podcasts: 'Podcasts',
    sermon: 'Sermon',
  };
  return map[category] ?? category;
}

/**
 * Get trending videos for the home page (from VIDEOS_ITEMS with isTrending)
 */
export function getTrendingVideosForHome(limit: number = 12): Array<{
  _id: string;
  title: string;
  creator: string;
  thumbnail: string;
  views: string;
  duration: string;
  category: string;
}> {
  return VIDEOS_ITEMS.filter(item => item.isTrending)
    .slice(0, limit)
    .map(item => ({
      _id: item._id,
      title: item.title,
      creator: item.creator,
      thumbnail: item.thumbnail,
      views: item.views ?? '0',
      duration: item.duration ?? '0:00',
      category: videoCategoryToLabel(item.category),
    }));
}

/**
 * Get a video item by its ID
 * @param _id - The string ID of the video item
 * @returns The video item if found, undefined otherwise
 */
export function getVideoItemById(_id: string): VideoItem | undefined {
  return VIDEOS_ITEMS.find(item => item._id === _id);
}

/**
 * Get related video items based on category
 * @param currentId - The ID of the current video item (to exclude)
 * @param category - The category to match
 * @param limit - Maximum number of related items to return (default: 3)
 * @returns Array of related video items
 */
export function getRelatedVideos(
  currentId: string,
  category: string,
  limit: number = 3
): VideoItem[] {
  return VIDEOS_ITEMS.filter(item => item._id !== currentId && item.category === category).slice(
    0,
    limit
  );
}

/**
 * Maps category IDs from the URL query parameter to actual category values in the data
 */
export const mapCategoryIdToValue = (categoryId: string | null | undefined): string | null => {
  if (!categoryId || categoryId === 'all') {
    return null; // null means show all
  }

  const categoryMap: Record<string, string> = {
    music: 'music',
    short: 'short',
    talks: 'talks',
    creative: 'creative',
    inspirational: 'inspirational',
    live: 'live',
    podcasts: 'podcasts',
    sermon: 'sermon',
  };

  return categoryMap[categoryId] || null;
};

/**
 * Server-side function to filter items by category
 */
export function filterByCategory<T extends { category?: string }>(
  items: T[],
  categoryId: string | null | undefined
): T[] {
  if (!categoryId || categoryId === 'all') {
    return items; // Show all items
  }

  const mappedCategory = mapCategoryIdToValue(categoryId);
  if (!mappedCategory) {
    return items; // If mapping fails, show all
  }

  // Case-insensitive comparison - filter items that have a category matching the mapped category
  return items.filter(
    item => item.category && item.category.toLowerCase() === mappedCategory.toLowerCase()
  );
}
