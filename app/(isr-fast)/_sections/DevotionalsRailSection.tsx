import { DevotionalsRail, type HomeDevotionalCard } from '@/components/section/home';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { ICommunityCategoryCountsRes } from '@/lib/constants/endpoints';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { HOME_ISR } from './shared';

export async function DevotionalsRailSection() {
  const res = await callPublicServerApi('PUBLIC_GET_COMMUNITY', {}, HOME_ISR);

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Devotionals unavailable"
        message={res.error?.message ?? 'Failed to load devotionals'}
      />
    );
  }

  const communityData = (res.data as ICommunityCategoryCountsRes | undefined) ?? {
    trendingDevotionals: [],
  };

  const trendingDevotionalRecords = communityData.trendingDevotionals ?? [];

  const items: HomeDevotionalCard[] = trendingDevotionalRecords.slice(0, 8).map(d => {
    const record = d as { coverImage?: string };
    return {
      _id: String(d._id ?? ''),
      title: String(d.title ?? ''),
      slug: String(d.slug ?? d._id ?? ''),
      excerpt: String(d.excerpt ?? ''),
      coverImage: typeof record.coverImage === 'string' ? record.coverImage : '',
    };
  });

  return <DevotionalsRail items={items} />;
}
