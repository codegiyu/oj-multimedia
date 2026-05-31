import { RisingArtistsColumn } from '@/components/section/home/TopChartsSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { IPublicArtistsListRes } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { HOME_ISR } from './shared';

export async function RisingArtistsSection() {
  const res = await callPublicServerApi(
    'PUBLIC_GET_ARTISTS',
    { query: '?page=1&limit=4' },
    HOME_ISR
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Rising artists unavailable"
        message={res.error?.message ?? 'Failed to load rising artists'}
      />
    );
  }

  const artists = (res.data as IPublicArtistsListRes | undefined)?.artists ?? [];

  const risingArtists = artists.map(artist => ({
    _id: artist._id,
    name: artist.name,
    image: artist.image ?? '',
    genre: artist.genre,
    followers: artist.followers?.toString() ?? '0',
    verified: artist.verified ?? false,
  }));

  return <RisingArtistsColumn risingArtists={risingArtists} />;
}
