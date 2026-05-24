import type { MusicAlbumSummary } from '@/lib/constants/endpoints';

export function publicMusicAlbumHref(album: Pick<MusicAlbumSummary, '_id' | 'slug'>): string {
  return `/music/albums/${album.slug || album._id}`;
}

export function resolvePublicMusicAlbum(item: {
  album?: MusicAlbumSummary;
  albumId?: string;
}): MusicAlbumSummary | undefined {
  if (item.album?.title) return item.album;

  if (item.albumId) {
    return { _id: item.albumId, title: item.albumId };
  }

  return undefined;
}
