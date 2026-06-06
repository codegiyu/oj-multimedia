import { CreatorSpotlight } from '@/components/section/video/CreatorSpotlight';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { buildArtistsBrowseQuery } from '@/lib/utils/artistsBrowse';
import { mapPublicArtistToFeaturedCreator } from '@/lib/utils/publicApiMappers';
import type { VideoSectionProps } from './shared';

export async function CreatorSpotlightSection({
  fetchOptions,
  maxItems = 6,
}: VideoSectionProps & { maxItems?: number }) {
  const res = await callPublicServerApi(
    'PUBLIC_GET_ARTISTS',
    { query: buildArtistsBrowseQuery(1, { limit: 6, scope: 'spotlight' }) },
    fetchOptions
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Creators unavailable"
        message={res.error?.message ?? 'Failed to load creators'}
      />
    );
  }

  const rawArtists = res.data?.artists ?? [];
  const featuredCreators = rawArtists
    .slice(0, maxItems)
    .map(a => mapPublicArtistToFeaturedCreator(a as unknown as Record<string, unknown>));

  return <CreatorSpotlight creators={featuredCreators} />;
}
