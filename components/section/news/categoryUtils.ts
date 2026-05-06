import { NEWS_CATEGORIES, mapCategoryIdToLabel } from '@/lib/constants/contentTaxonomy';

/**
 * Maps category IDs from the URL query parameter to actual category values in the data
 */
export const mapCategoryIdToValue = (categoryId: string | null | undefined): string | null => {
  return mapCategoryIdToLabel(categoryId, NEWS_CATEGORIES);
};

/**
 * Server-side function to filter items by category
 */
export function filterByCategory<T extends { category: string }>(
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

  // Case-insensitive comparison
  return items.filter(item => item.category.toLowerCase() === mappedCategory.toLowerCase());
}

/**
 * Client-side function: Checks if an item's category matches the selected category filter
 * @deprecated Use server-side filtering instead
 */
export const matchesCategory = (
  itemCategory: string,
  selectedCategoryId: string | null
): boolean => {
  if (!selectedCategoryId || selectedCategoryId === 'all') {
    return true; // Show all items
  }

  const mappedCategory = mapCategoryIdToValue(selectedCategoryId);
  if (!mappedCategory) {
    return true; // If mapping fails, show all
  }

  // Case-insensitive comparison
  return itemCategory.toLowerCase() === mappedCategory.toLowerCase();
};
