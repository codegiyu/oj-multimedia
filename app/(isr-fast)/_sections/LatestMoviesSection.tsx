import { SimpleVideoRail } from '@/components/section/home';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { IPublicVideosListRes } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicVideoToHomeTrending } from '@/lib/utils/homeTrendingMappers';
import { HOME_ISR } from './shared';

export async function LatestMoviesSection() {
  const query = new URLSearchParams({
    limit: '12',
    page: '1',
    status: 'published',
    type: 'long-form',
  });

  const res = await callPublicServerApi(
    'PUBLIC_GET_VIDEOS',
    { query: `?${query.toString()}` },
    HOME_ISR
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Latest movies unavailable"
        message={res.error?.message ?? 'Failed to load latest movies'}
      />
    );
  }

  const videos = ((res.data as IPublicVideosListRes | undefined)?.videos ?? []).map(
    mapPublicVideoToHomeTrending
  );

  return (
    <SimpleVideoRail
      heading="Latest movies"
      subtext="Films and long-form video"
      viewAllLink="/videos"
      videos={videos}
    />
  );
}
