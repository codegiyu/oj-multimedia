import { AllArtistsPageClient } from '@/components/section/community/artists/AllArtistsPageClient';
import { getAllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import { callPublicServerApi } from '@/lib/services/serverApi';
import {
  buildAllBrowseListQuery,
  parseAllBrowseQueryParams,
  type AllBrowseSearchParams,
} from '@/lib/utils/allBrowseQuery';
import { mapToCommunityArtist } from '@/lib/utils/communityApiMappers';
import type { CommunityArtist } from '@/components/section/community/artists/ArtistsPageClient';

type AllArtistsBrowseSectionProps = {
  searchParams: AllBrowseSearchParams;
};

export async function AllArtistsBrowseSection({ searchParams }: AllArtistsBrowseSectionProps) {
  const config = getAllBrowseConfig('artist');
  const queryParams = parseAllBrowseQueryParams(searchParams);
  const query = buildAllBrowseListQuery(config, queryParams);

  const res = await callPublicServerApi('PUBLIC_GET_ARTISTS', { query });

  if (res.type === 'error') {
    return (
      <AllArtistsPageClient
        config={config}
        artists={[]}
        pagination={null}
        initialErrorMessage={res.error?.message ?? 'Failed to load artists'}
      />
    );
  }

  const artists = (res.data?.artists ?? []).map(item =>
    mapToCommunityArtist(item as unknown as Record<string, unknown>)
  ) as CommunityArtist[];

  return (
    <AllArtistsPageClient
      config={config}
      artists={artists}
      pagination={res.data?.pagination ?? null}
    />
  );
}
