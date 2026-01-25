/**
 * Maps category IDs from the URL query parameter to actual category values in the data
 */
export const mapCategoryIdToValue = (categoryId: string | null | undefined): string | null => {
  if (!categoryId || categoryId === 'all') {
    return null; // null means show all
  }

  const categoryMap: Record<string, string> = {
    'christian-celebrity-news': 'Christian Celebrity News',
    'church-announcements': 'Church & Ministry Announcements',
    'inspirational-stories': 'Inspirational Stories',
    'scholarship-alerts': 'Scholarship Alerts',
    'jobs-ngo': 'Jobs (NGO / Faith-based)',
    'christian-movie-reviews': 'Christian Movie Reviews',
  };

  return categoryMap[categoryId] || null;
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
