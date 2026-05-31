import { SectionLoadError } from '@/components/general/SectionLoadError';
import { ArtistMusicGrid } from '@/components/section/community/artists/ArtistCatalogGrids';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicMusicToDetailItem } from '@/lib/utils/publicApiMappers';
import type { IPublicMusicListRes } from '@/lib/constants/endpoints';
import type { MusicItemWithArtist } from '@/lib/utils/music';

type ArtistMusicSectionProps = {
  artistId: string;
};

export async function ArtistMusicSection({ artistId }: ArtistMusicSectionProps) {
  const res = await callPublicServerApi('PUBLIC_GET_MUSIC', {
    query: `?artist=${encodeURIComponent(artistId)}&status=published&page=1&limit=12`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Music unavailable"
        message={res.error?.message ?? 'Failed to load artist music'}
      />
    );
  }

  const musicItems: MusicItemWithArtist[] = ((res.data as IPublicMusicListRes)?.music ?? []).map(
    m => mapPublicMusicToDetailItem(m)
  );

  return <ArtistMusicGrid items={musicItems} />;
}
