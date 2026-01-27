import {
  PRAYER_REQUESTS_ITEMS,
  type PrayerRequestItem,
} from '@/lib/constants/community/prayer-requests';

/**
 * Get a prayer request item by its ID
 * @param id - The numeric ID of the prayer request item
 * @returns The prayer request item if found, undefined otherwise
 */
export function getPrayerRequestById(id: number): PrayerRequestItem | undefined {
  return PRAYER_REQUESTS_ITEMS.find(item => item.id === id);
}

/**
 * Get related prayer request items based on category
 * @param currentId - The ID of the current prayer request item (to exclude)
 * @param category - The category to match
 * @param limit - Maximum number of related items to return (default: 3)
 * @returns Array of related prayer request items
 */
export function getRelatedRequests(
  currentId: number,
  category: string,
  limit: number = 3
): PrayerRequestItem[] {
  return PRAYER_REQUESTS_ITEMS.filter(
    item => item.id !== currentId && item.category === category
  ).slice(0, limit);
}

/**
 * Maps category IDs from the URL query parameter to actual category values in the data
 */
export const mapCategoryIdToValue = (categoryId: string | null | undefined): string | null => {
  if (!categoryId || categoryId === 'all') {
    return null; // null means show all
  }

  const categoryMap: Record<string, string> = {
    healing: 'Healing',
    finance: 'Finance',
    family: 'Family',
    career: 'Career',
    spiritual: 'Spiritual',
    protection: 'Protection',
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
