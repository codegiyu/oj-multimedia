import type { MusicDownloadInput, MusicDownloadSource } from '@/lib/services/contentDownload';
import { resolveContentPrice } from '@/lib/services/contentDownload';
import type { MusicItemWithArtist } from '@/lib/utils/music';

export interface MusicCardDownloadFields {
  _id: string;
  slug?: string;
  title: string;
  artist: string | { _id: string; name: string };
  downloadUrl?: string;
  audioUrl?: string;
  isMonetizable?: boolean;
  price?: number;
  downloadPrice?: number;
}

export function toMusicDownloadInputFromItem(
  musicItem: MusicItemWithArtist,
  source: MusicDownloadSource = 'detail'
): MusicDownloadInput {
  const artistName =
    typeof musicItem.artist === 'string' ? musicItem.artist : musicItem.artist.name;

  return {
    _id: musicItem._id,
    slug: musicItem.slug,
    title: musicItem.title,
    artistName,
    downloadUrl: musicItem.downloadUrl,
    audioUrl: musicItem.audioUrl,
    isMonetizable: musicItem.isMonetizable,
    price: resolveContentPrice(musicItem),
    downloadPrice: resolveContentPrice(musicItem),
    source,
  };
}

export function toMusicDownloadInputFromCard(
  fields: MusicCardDownloadFields,
  source: MusicDownloadSource = 'card'
): MusicDownloadInput {
  const artistName = typeof fields.artist === 'string' ? fields.artist : fields.artist.name;

  return {
    _id: fields._id,
    slug: fields.slug,
    title: fields.title,
    artistName,
    downloadUrl: fields.downloadUrl,
    audioUrl: fields.audioUrl,
    isMonetizable: fields.isMonetizable,
    price: resolveContentPrice(fields),
    downloadPrice: resolveContentPrice(fields),
    source,
  };
}
