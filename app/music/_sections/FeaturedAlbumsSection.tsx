import { FeaturedAlbums } from '@/components/section/music/FeaturedAlbums';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { IPublicAlbumsListRes } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { filterPublicAlbumList, mapPublicAlbumToCard } from '@/lib/utils/publicApiMappers';

export async function FeaturedAlbumsSection() {
  const res = await callPublicServerApi('PUBLIC_GET_ALBUMS', {
    query: '?limit=12&page=1&type=featured' as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Featured albums unavailable"
        message={res.error?.message ?? 'Failed to load featured albums'}
      />
    );
  }

  const albums = filterPublicAlbumList((res.data as IPublicAlbumsListRes)?.albums ?? []).map(
    mapPublicAlbumToCard
  );

  if (albums.length === 0) {
    return null;
  }

  return <FeaturedAlbums albums={albums} />;
}
