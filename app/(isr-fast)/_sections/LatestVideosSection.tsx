import { SimpleVideoRail } from '@/components/section/home';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { IPublicVideosListRes } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicVideoToHomeTrending } from '@/lib/utils/homeTrendingMappers';
import { HOME_ISR } from './shared';

export async function LatestVideosSection() {
  const recentQuery = new URLSearchParams({
    limit: '12',
    page: '1',
    status: 'published',
    type: 'recent',
  });
  const trendingQuery = new URLSearchParams({
    limit: '12',
    page: '1',
    status: 'published',
    type: 'trending',
  });

  const [recentRes, trendingRes] = await Promise.all([
    callPublicServerApi('PUBLIC_GET_VIDEOS', { query: `?${recentQuery.toString()}` }, HOME_ISR),
    callPublicServerApi('PUBLIC_GET_VIDEOS', { query: `?${trendingQuery.toString()}` }, HOME_ISR),
  ]);

  if (recentRes.type === 'error') {
    return (
      <SectionLoadError
        title="Latest videos unavailable"
        message={recentRes.error?.message ?? 'Failed to load latest videos'}
      />
    );
  }

  const trendingIds = new Set(
    (
      (trendingRes.type === 'success' ? trendingRes.data : undefined) as
        | IPublicVideosListRes
        | undefined
    )?.videos?.map(v => v._id) ?? []
  );

  const videos = ((recentRes.data as IPublicVideosListRes | undefined)?.videos ?? [])
    .filter(video => !trendingIds.has(video._id))
    .map(mapPublicVideoToHomeTrending);

  return (
    <SimpleVideoRail
      heading="Latest videos"
      subtext="Recently published videos"
      viewAllLink="/videos"
      videos={videos}
    />
  );
}
