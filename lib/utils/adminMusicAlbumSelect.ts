import type { ArtistMusicListItem } from '@/lib/constants/endpoints';
import type { SelectOption } from '@/lib/types/general';
import { callApi } from '@/lib/services/callApi';

export function resolveContentArtistId(
  artist: ArtistMusicListItem['artist'] | undefined
): string | null {
  if (!artist) return null;

  if (typeof artist === 'string') {
    const trimmed = artist.trim();

    return trimmed || null;
  }

  const id = (artist as { _id?: string })._id;

  return id?.trim() || null;
}

export function musicAlbumRecordId(
  music: Pick<ArtistMusicListItem, 'album' | 'albumId'>
): string | null {
  if (music.album && typeof music.album === 'object' && music.album._id) {
    const id = String(music.album._id).trim();
    return id || null;
  }

  if (music.albumId) {
    const id = String(music.albumId).trim();
    return id || null;
  }

  return null;
}

export function musicAlbumLabel(music: Pick<ArtistMusicListItem, 'album' | 'albumId'>): string {
  if (music.album && typeof music.album === 'object' && music.album.title) {
    return music.album.title;
  }

  if (music.albumId) return music.albumId;

  return '—';
}

export async function loadPublishedAlbumSelectOptions(artistId: string): Promise<SelectOption[]> {
  const params = new URLSearchParams();
  params.set('artist', artistId);
  params.set('status', 'published');
  params.set('limit', '500');

  const res = await callApi('ADMIN_ALBUMS_LIST', {
    query: `?${params.toString()}` as `?${string}`,
  });

  if (res.type !== 'success') {
    return [{ text: 'No album', value: '' }];
  }

  const albums = res.data.albums ?? [];

  return [{ text: 'No album', value: '' }, ...albums.map(a => ({ text: a.title, value: a._id }))];
}

export function ensureAlbumSelectContainsCurrent(
  options: SelectOption[],
  albumId: string | undefined,
  albumTitle: string | undefined
): SelectOption[] {
  if (!albumId?.trim()) return options;

  if (options.some(o => o.value === albumId)) return options;

  return [...options, { text: albumTitle?.trim() || `Album ${albumId}`, value: albumId }];
}
