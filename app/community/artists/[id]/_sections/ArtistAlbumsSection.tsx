import { SectionLoadError } from '@/components/general/SectionLoadError';
import { ArtistAlbumsGrid } from '@/components/section/community/artists/ArtistCatalogGrids';
import { callPublicServerApi } from '@/lib/services/serverApi';
import type { IPublicAlbumsListRes } from '@/lib/constants/endpoints';
import { filterPublicAlbumList, mapPublicAlbumToCard } from '@/lib/utils/publicApiMappers';

type ArtistAlbumsSectionProps = {
  artistId: string;
};

export async function ArtistAlbumsSection({ artistId }: ArtistAlbumsSectionProps) {
  const res = await callPublicServerApi('PUBLIC_GET_ALBUMS', {
    query: `?artist=${encodeURIComponent(artistId)}&page=1&limit=12`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Albums unavailable"
        message={res.error?.message ?? 'Failed to load artist albums'}
      />
    );
  }

  const albumItems = filterPublicAlbumList((res.data as IPublicAlbumsListRes)?.albums ?? []).map(
    mapPublicAlbumToCard
  );

  return <ArtistAlbumsGrid items={albumItems} />;
}
