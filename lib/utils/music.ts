import { MUSIC_ITEMS, type MusicItem } from '@/lib/constants/music';

/**
 * Get a music item by its ID
 * @param id - The numeric ID of the music item
 * @returns The music item if found, undefined otherwise
 */
export function getMusicItemById(id: number): MusicItem | undefined {
  return MUSIC_ITEMS.find(item => item.id === id);
}

/**
 * Get related music items based on category
 * @param currentId - The ID of the current music item (to exclude)
 * @param category - The category to match
 * @param limit - Maximum number of related items to return (default: 3)
 * @returns Array of related music items
 */
export function getRelatedMusicItems(
  currentId: number,
  category: string,
  limit: number = 3
): MusicItem[] {
  return MUSIC_ITEMS.filter(item => item.id !== currentId && item.category === category).slice(
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
    afrobeats: 'afrobeats',
    hiphop: 'hiphop',
    pop: 'pop',
    rnb: 'rnb',
    gospel: 'gospel',
    instrumental: 'instrumental',
    acoustic: 'acoustic',
    worship: 'worship',
    spoken: 'spoken',
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
