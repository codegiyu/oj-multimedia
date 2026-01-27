import { DEVOTIONALS_ITEMS, type DevotionalItem } from '@/lib/constants/community/devotionals';

/**
 * Get a devotional item by its ID
 * @param id - The numeric ID of the devotional item
 * @returns The devotional item if found, undefined otherwise
 */
export function getDevotionalById(id: number): DevotionalItem | undefined {
  return DEVOTIONALS_ITEMS.find(item => item.id === id);
}

/**
 * Get related devotional items based on category
 * @param currentId - The ID of the current devotional item (to exclude)
 * @param category - The category to match
 * @param limit - Maximum number of related items to return (default: 3)
 * @returns Array of related devotional items
 */
export function getRelatedDevotionals(
  currentId: number,
  category: string,
  limit: number = 3
): DevotionalItem[] {
  return DEVOTIONALS_ITEMS.filter(
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
    faith: 'Faith',
    prayer: 'Prayer',
    love: 'Love',
    peace: 'Peace',
    'bible-study': 'Bible Study',
    'spiritual-growth': 'Spiritual Growth',
    productivity: 'Productivity',
    'spiritual-warfare': 'Spiritual Warfare',
    attitude: 'Attitude',
    marriage: 'Marriage',
    parenting: 'Parenting',
    family: 'Family',
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
