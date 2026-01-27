import { QUESTIONS_ITEMS, type QuestionItem } from '@/lib/constants/community/questions';

/**
 * Get a question item by its ID
 * @param id - The numeric ID of the question item
 * @returns The question item if found, undefined otherwise
 */
export function getQuestionById(id: number): QuestionItem | undefined {
  return QUESTIONS_ITEMS.find(item => item.id === id);
}

/**
 * Get related question items based on category
 * @param currentId - The ID of the current question item (to exclude)
 * @param category - The category to match
 * @param limit - Maximum number of related items to return (default: 3)
 * @returns Array of related question items
 */
export function getRelatedQuestions(
  currentId: number,
  category: string,
  limit: number = 3
): QuestionItem[] {
  return QUESTIONS_ITEMS.filter(item => item.id !== currentId && item.category === category).slice(
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
    faith: 'Faith',
    relationships: 'Relationships',
    'spiritual-growth': 'Spiritual Growth',
    finance: 'Finance',
    'bible-study': 'Bible Study',
    prayer: 'Prayer',
    'spiritual-gifts': 'Spiritual Gifts',
    'mental-health': 'Mental Health',
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
