import { TESTIMONIES_ITEMS, type TestimonyItem } from '@/lib/constants/community/testimonies';

/**
 * Get a testimony item by its ID
 * @param id - The ID of the testimony item (string from URL)
 * @returns The testimony item if found, undefined otherwise
 */
export function getTestimonyById(id: string): TestimonyItem | undefined {
  if (!id) return undefined;
  return TESTIMONIES_ITEMS.find(item => item._id === id);
}

/**
 * Get related testimony items based on category
 * @param currentId - The ID of the current testimony item (to exclude)
 * @param category - The category to match
 * @param limit - Maximum number of related items to return (default: 3)
 * @returns Array of related testimony items
 */
export function getRelatedTestimonies(
  currentId: string,
  category: string,
  limit: number = 3
): TestimonyItem[] {
  if (!currentId) return [];
  return TESTIMONIES_ITEMS.filter(
    item => item._id !== currentId && item.category === category
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
    purpose: 'Purpose',
    prayer: 'Prayer',
    marriage: 'Marriage',
    provision: 'Provision',
    deliverance: 'Deliverance',
    salvation: 'Salvation',
    blessing: 'Blessing',
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
