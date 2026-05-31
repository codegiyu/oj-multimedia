import { ArtistsPageClient } from '@/components/section/community/artists/ArtistsPageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToCommunityArtist } from '@/lib/utils/communityApiMappers';

const ARTISTS_LIMIT = 24;

type ArtistsListSectionProps = {
  page: number;
};

export async function ArtistsListSection({ page }: ArtistsListSectionProps) {
  const res = await callPublicServerApi('PUBLIC_GET_ARTISTS', {
    query: `?limit=${ARTISTS_LIMIT}&page=${page}` as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Artists unavailable"
        message={res.error?.message ?? 'Failed to load artists'}
      />
    );
  }

  const artists = (res.data?.artists ?? []).map(i =>
    mapToCommunityArtist(i as unknown as Record<string, unknown>)
  );
  const pagination = res.data?.pagination ?? null;

  return <ArtistsPageClient artists={artists} pagination={pagination} initialErrorMessage={null} />;
}
