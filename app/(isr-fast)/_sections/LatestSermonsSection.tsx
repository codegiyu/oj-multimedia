import { SimpleMusicRail } from '@/components/section/home';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { IPublicMusicListRes } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicMusicToHomeTrending } from '@/lib/utils/homeTrendingMappers';
import { HOME_ISR } from './shared';

export async function LatestSermonsSection() {
  const query = new URLSearchParams({
    limit: '12',
    page: '1',
    status: 'published',
    type: 'recent',
    category: 'sermon',
  });

  const res = await callPublicServerApi(
    'PUBLIC_GET_MUSIC',
    { query: `?${query.toString()}` },
    HOME_ISR
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Latest sermons unavailable"
        message={res.error?.message ?? 'Failed to load latest sermons'}
      />
    );
  }

  const music = ((res.data as IPublicMusicListRes | undefined)?.music ?? []).map(
    mapPublicMusicToHomeTrending
  );

  return (
    <SimpleMusicRail
      heading="Latest sermons"
      subtext="Teaching and messages"
      viewAllLink="/music"
      music={music}
    />
  );
}
