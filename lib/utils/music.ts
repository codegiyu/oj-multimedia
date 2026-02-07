import { MUSIC_ITEMS, type MusicItem } from '@/lib/constants/music';

/** Category to display genre label (e.g. for home section) */
function categoryToGenre(category: MusicItem['category']): string {
  const map: Record<string, string> = {
    afrobeats: 'Afrobeats',
    hiphop: 'Hip-Hop',
    pop: 'Pop',
    rnb: 'R&B',
    gospel: 'Gospel',
    instrumental: 'Instrumental',
    acoustic: 'Acoustic',
    worship: 'Worship',
    spoken: 'Spoken',
    sermon: 'Sermon',
  };
  return map[category] ?? category;
}

/**
 * Get trending music items for the home page (from MUSIC_ITEMS with isTrending)
 */
export function getTrendingMusicForHome(limit: number = 12): Array<{
  _id: string;
  title: string;
  artist: string;
  cover: string;
  plays: string;
  genre: string;
  isNew: boolean;
}> {
  return MUSIC_ITEMS.filter(item => item.isTrending)
    .slice(0, limit)
    .map(item => ({
      _id: item._id,
      title: item.title,
      artist: item.artist,
      cover: item.cover,
      plays: item.plays ?? '0',
      genre: item.genre ?? categoryToGenre(item.category),
      isNew: item.isNew ?? false,
    }));
}

/**
 * Get chart data for the home page (from MUSIC_ITEMS with isChart, sorted by rank)
 */
export function getChartDataForHome(limit: number = 10): Array<{
  _id: string;
  rank: number;
  title: string;
  artist: string;
  cover: string;
  plays: string;
  trend: 'up' | 'down' | 'same';
  change?: number;
}> {
  return MUSIC_ITEMS.filter(
    (item): item is MusicItem & { rank: number; trend: 'up' | 'down' | 'same' } =>
      Boolean(item.isChart && item.rank != null && item.trend)
  )
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map(item => ({
      _id: item._id,
      rank: item.rank,
      title: item.title,
      artist: item.artist,
      cover: item.cover,
      plays: item.plays ?? '0',
      trend: item.trend,
      change: item.change,
    }));
}

/**
 * Get rising/featured artists for the home page (from MUSIC_ITEMS with isFeaturedArtist)
 */
export function getRisingArtistsForHome(limit: number = 4): Array<{
  name: string;
  genre: string;
  image: string;
  followers: string;
}> {
  return MUSIC_ITEMS.filter(item => item.isFeaturedArtist)
    .slice(0, limit)
    .map(item => ({
      name: item.name ?? item.artist,
      genre: item.genre ?? categoryToGenre(item.category),
      image: item.image ?? item.cover,
      followers: item.followers ?? '0',
    }));
}

/**
 * Get a music item by its ID
 * @param _id - The string ID of the music item
 * @returns The music item if found, undefined otherwise
 */
export function getMusicItemById(_id: string): MusicItem | undefined {
  return MUSIC_ITEMS.find(item => item._id === _id);
}

/**
 * Get related music items based on category
 * @param currentId - The ID of the current music item (to exclude)
 * @param category - The category to match
 * @param limit - Maximum number of related items to return (default: 3)
 * @returns Array of related music items
 */
export function getRelatedMusicItems(
  currentId: string,
  category: string,
  limit: number = 3
): MusicItem[] {
  return MUSIC_ITEMS.filter(item => item._id !== currentId && item.category === category).slice(
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
    sermon: 'sermon',
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
