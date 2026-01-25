import { VIDEOS_ITEMS, type VideoItem } from '@/lib/constants/videos';

/**
 * Get a video item by its ID
 * @param id - The numeric ID of the video item
 * @returns The video item if found, undefined otherwise
 */
export function getVideoItemById(id: number): VideoItem | undefined {
  return VIDEOS_ITEMS.find(item => item.id === id);
}

/**
 * Get related video items based on category
 * @param currentId - The ID of the current video item (to exclude)
 * @param category - The category to match
 * @param limit - Maximum number of related items to return (default: 3)
 * @returns Array of related video items
 */
export function getRelatedVideos(
  currentId: number,
  category: string,
  limit: number = 3
): VideoItem[] {
  return VIDEOS_ITEMS.filter(item => item.id !== currentId && item.category === category).slice(
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
