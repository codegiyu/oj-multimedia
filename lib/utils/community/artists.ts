import { ARTIST_PROFILES } from '@/lib/constants/community/artists';
import type { ArtistProfile } from '@/lib/types/artist';
import type { MusicItem } from '@/lib/constants/music';
import { MUSIC_ITEMS } from '@/lib/constants/music';
import type { VideoItem } from '@/lib/constants/videos';
import { VIDEOS_ITEMS } from '@/lib/constants/videos';

/**
 * Get an artist profile by ID
 */
export function getArtistById(id: string): ArtistProfile | undefined {
  if (!id) return undefined;
  return ARTIST_PROFILES.find(p => p._id === id);
}

/**
 * Get all artist profiles (optionally filter by featured)
 */
export function getAllArtists(featuredOnly = false): ArtistProfile[] {
  if (featuredOnly) {
    return ARTIST_PROFILES.filter(p => p.isFeatured);
  }
  return [...ARTIST_PROFILES];
}

/** Music item with artist populated */
export type MusicItemWithArtist = Omit<MusicItem, 'artist'> & { artist: PopulatedArtist };

/** Video item with creator populated */
export type VideoItemWithCreator = Omit<VideoItem, 'creator'> & { creator: PopulatedArtist };

/**
 * Get music items by artist profile ID (artist field is the _id). Artist is populated to { _id, name }.
 */
export function getMusicByArtistId(artistId: string, limit = 12): MusicItemWithArtist[] {
  if (!artistId) return [];
  return MUSIC_ITEMS.filter(item => item.artist === artistId)
    .slice(0, limit)
    .map(item => {
      const artist = populateArtist(item.artist) ?? { _id: item.artist, name: 'Unknown' };
      return { ...item, artist };
    });
}

/**
 * Get video items by artist profile ID (creator field is the _id). Creator is populated to { _id, name }.
 */
export function getVideosByArtistId(artistId: string, limit = 12): VideoItemWithCreator[] {
  if (!artistId) return [];
  return VIDEOS_ITEMS.filter(item => item.creator === artistId)
    .slice(0, limit)
    .map(item => {
      const creator = populateArtist(item.creator) ?? { _id: item.creator, name: 'Unknown' };
      return { ...item, creator };
    });
}

/** Populated artist shape returned by getters */
export interface PopulatedArtist {
  _id: string;
  name: string;
}

/**
 * Resolve artist _id to { _id, name } from ARTIST_PROFILES
 */
export function populateArtist(artistId: string): PopulatedArtist | null {
  const artist = ARTIST_PROFILES.find(p => p._id === artistId);
  if (!artist) return null;
  return { _id: artist._id, name: artist.name };
}
