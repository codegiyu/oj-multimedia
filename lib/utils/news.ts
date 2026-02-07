import { NEWS_ITEMS, type NewsItem } from '@/lib/constants/news';

/**
 * Get news articles for the home page (featured + latest from NEWS_ITEMS)
 */
export function getNewsArticlesForHome(limit: number = 6): Array<{
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  time: string;
  image: string;
  featured?: boolean;
}> {
  const featured = NEWS_ITEMS.filter(item => item.isFeatured ?? item.isLatest);
  const byLatest = [...featured].sort((a, b) => {
    const aDate = a.date ? new Date(a.date).getTime() : 0;
    const bDate = b.date ? new Date(b.date).getTime() : 0;
    return bDate - aDate;
  });
  return byLatest.slice(0, limit).map(item => ({
    _id: item._id,
    title: item.title,
    excerpt: item.excerpt ?? '',
    category: item.category,
    time: item.readTime ?? item.date ?? '',
    image: item.image,
    featured: item.isFeatured,
  }));
}

/**
 * Get a news item by its ID
 * @param id - The ID of the news item (string from URL)
 * @returns The news item if found, undefined otherwise
 */
export function getNewsItemById(id: string): NewsItem | undefined {
  if (!id) return undefined;
  return NEWS_ITEMS.find(item => String(item._id) === id);
}

/**
 * Get related news items based on category
 * @param currentId - The ID of the current news item (to exclude)
 * @param category - The category to match
 * @param limit - Maximum number of related items to return (default: 3)
 * @returns Array of related news items
 */
export function getRelatedNewsItems(
  currentId: string,
  category: string,
  limit: number = 3
): NewsItem[] {
  if (!currentId) return [];
  return NEWS_ITEMS.filter(item => item._id !== currentId && item.category === category).slice(
    0,
    limit
  );
}
