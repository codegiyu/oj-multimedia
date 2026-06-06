import { FeaturedArtists } from '@/components/section/music/FeaturedArtists';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { buildArtistsBrowseQuery } from '@/lib/utils/artistsBrowse';
import { mapPublicArtistToFeaturedArtist } from '@/lib/utils/publicApiMappers';

export async function FeaturedArtistsSection() {
  const res = await callPublicServerApi('PUBLIC_GET_ARTISTS', {
    query: buildArtistsBrowseQuery(1, { limit: 6, scope: 'featured' }),
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Featured artists unavailable"
        message={res.error?.message ?? 'Failed to load featured artists'}
      />
    );
  }

  const artists = (res.data?.artists ?? [])
    .slice(0, 6)
    .map(artist => mapPublicArtistToFeaturedArtist(artist as unknown as Record<string, unknown>));

  if (artists.length === 0) {
    return null;
  }

  return <FeaturedArtists artists={artists} />;
}
