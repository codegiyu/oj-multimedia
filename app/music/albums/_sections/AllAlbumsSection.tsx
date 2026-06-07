import { AllAlbumsPageClient } from '@/components/section/music/AllAlbumsPageClient';
import { getAllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { IPublicAlbumsListRes } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';
import {
  buildAllBrowseListQuery,
  parseAllBrowseQueryParams,
  type AllBrowseSearchParams,
} from '@/lib/utils/allBrowseQuery';
import { filterPublicAlbumList, mapPublicAlbumToCard } from '@/lib/utils/publicApiMappers';

type AllAlbumsSectionProps = {
  searchParams: AllBrowseSearchParams;
};

export async function AllAlbumsSection({ searchParams }: AllAlbumsSectionProps) {
  const config = getAllBrowseConfig('album');
  const queryParams = parseAllBrowseQueryParams(searchParams);
  const query = buildAllBrowseListQuery(config, queryParams);
  const res = await callPublicServerApi('PUBLIC_GET_ALBUMS', { query });

  if (res.type === 'error') {
    return (
      <AllAlbumsPageClient
        config={config}
        albums={[]}
        pagination={null}
        initialErrorMessage={res.error?.message ?? 'Failed to load albums'}
      />
    );
  }

  const albums = filterPublicAlbumList((res.data as IPublicAlbumsListRes)?.albums ?? []).map(
    mapPublicAlbumToCard
  );

  return (
    <AllAlbumsPageClient
      config={config}
      albums={albums}
      pagination={res.data?.pagination ?? null}
    />
  );
}
