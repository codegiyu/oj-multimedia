import { NEWS_ITEMS, type NewsItem } from '@/lib/constants/news';

/**
 * Get a news item by its ID
 * @param id - The numeric ID of the news item
 * @returns The news item if found, undefined otherwise
 */
export function getNewsItemById(id: number): NewsItem | undefined {
  return NEWS_ITEMS.find(item => item.id === id);
}

/**
 * Get related news items based on category
 * @param currentId - The ID of the current news item (to exclude)
 * @param category - The category to match
 * @param limit - Maximum number of related items to return (default: 3)
 * @returns Array of related news items
 */
export function getRelatedNewsItems(
  currentId: number,
  category: string,
  limit: number = 3
): NewsItem[] {
  return NEWS_ITEMS.filter(item => item.id !== currentId && item.category === category).slice(
    0,
    limit
  );
}
