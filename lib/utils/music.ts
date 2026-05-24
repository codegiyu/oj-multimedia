import { ARTIST_PROFILES } from '@/lib/constants/community/artists';
import {
  ALL_CATEGORY_ID,
  MUSIC_CATEGORIES,
  normalizeCategoryId,
} from '@/lib/constants/contentTaxonomy';
import { populateArtist } from '@/lib/utils/community/artists';
import type { ArtistProfile } from '@/lib/types/artist';
import type { MusicAlbumSummary } from '@/lib/constants/endpoints';
import { MUSIC_ITEMS, type MusicItem } from '@/lib/constants/music';

export type MusicItemArtist = { _id: string; name: string };

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
 * Get trending music items for the home page (from MUSIC_ITEMS with isTrending).
 * Artist is populated to { _id, name }.
 */
export function getTrendingMusicForHome(limit: number = 12): Array<{
  _id: string;
  title: string;
  artist: MusicItemArtist;
  cover: string;
  plays: string;
  genre: string;
  isNew: boolean;
}> {
  return MUSIC_ITEMS.filter(item => item.isTrending)
    .slice(0, limit)
    .map(item => {
      const artist = populateArtist(item.artist) ?? { _id: item.artist, name: 'Unknown' };
      return {
        _id: item._id,
        title: item.title,
        artist,
        cover: item.cover,
        plays: item.plays ?? '0',
        genre: item.genre ?? categoryToGenre(item.category),
        isNew: item.isNew ?? false,
      };
    });
}

/**
 * Get chart data for the home page (from MUSIC_ITEMS with isChart, sorted by rank).
 * Artist is populated to { _id, name }.
 */
export function getChartDataForHome(limit: number = 10): Array<{
  _id: string;
  rank: number;
  title: string;
  artist: MusicItemArtist;
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
    .map(item => {
      const artist = populateArtist(item.artist) ?? { _id: item.artist, name: 'Unknown' };
      return {
        _id: item._id,
        rank: item.rank,
        title: item.title,
        artist,
        cover: item.cover,
        plays: item.plays ?? '0',
        trend: item.trend,
        change: item.change,
      };
    });
}

/**
 * Get rising artists for the home page (from ARTIST_PROFILES with isRising)
 */
export function getRisingArtistsForHome(limit: number = 4): ArtistProfile[] {
  return ARTIST_PROFILES.filter(p => p.isRising).slice(0, limit);
}

/** Music item with artist populated to { _id, name } */
export type MusicItemWithArtist = Omit<MusicItem, 'artist'> & {
  artist: MusicItemArtist;
  album?: MusicAlbumSummary;
};

/**
 * Get a music item by its ID. Artist is populated to { _id, name }.
 * @param _id - The string ID of the music item
 * @returns The music item if found (with artist populated), undefined otherwise
 */
export function getMusicItemById(_id: string): MusicItemWithArtist | undefined {
  const item = MUSIC_ITEMS.find(i => i._id === _id);
  if (!item) return undefined;
  const artist = populateArtist(item.artist) ?? { _id: item.artist, name: 'Unknown' };
  return { ...item, artist };
}

/**
 * Get related music items based on category. Artist is populated to { _id, name }.
 * @param currentId - The ID of the current music item (to exclude)
 * @param category - The category to match
 * @param limit - Maximum number of related items to return (default: 3)
 * @returns Array of related music items with artist populated
 */
export function getRelatedMusicItems(
  currentId: string,
  category: string,
  limit: number = 3
): MusicItemWithArtist[] {
  return MUSIC_ITEMS.filter(item => item._id !== currentId && item.category === category)
    .slice(0, limit)
    .map(item => {
      const artist = populateArtist(item.artist) ?? { _id: item.artist, name: 'Unknown' };
      return { ...item, artist };
    });
}

/**
 * Maps category IDs from the URL query parameter to actual category values in the data
 */
export const mapCategoryIdToValue = (categoryId: string | null | undefined): string | null => {
  const normalizedCategory = normalizeCategoryId(categoryId, MUSIC_CATEGORIES);
  if (normalizedCategory === ALL_CATEGORY_ID) {
    return null; // null means show all
  }
  return normalizedCategory;
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
