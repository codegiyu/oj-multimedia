import { TrendingDevotionals } from '@/components/section/community/TrendingDevotionals';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToDevotional } from '@/lib/utils/communityApiMappers';

export async function TrendingDevotionalsHubSection() {
  const res = await callPublicServerApi('PUBLIC_GET_COMMUNITY', {});

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Trending devotionals unavailable"
        message={res.error?.message ?? 'Failed to load trending devotionals'}
      />
    );
  }

  const rawTrending = (res.data?.trendingDevotionals ?? []) as unknown[];
  const devotionals = rawTrending.map(d => mapToDevotional(d as Record<string, unknown>));

  return <TrendingDevotionals devotionals={devotionals} />;
}
