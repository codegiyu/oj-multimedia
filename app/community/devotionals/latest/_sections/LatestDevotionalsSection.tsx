import { DailyDevotionalsSection } from '@/components/section/community/devotionals/DailyDevotionalsSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToDailyDevotional } from '@/lib/utils/communityApiMappers';
import type { DailyDevotional } from '@/components/section/community/devotionals/DevotionalsPageClient';

type LatestDevotionalsSectionProps = {
  category: string;
};

export async function LatestDevotionalsSection({ category }: LatestDevotionalsSectionProps) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const res = await callPublicServerApi('PUBLIC_GET_DEVOTIONALS', {
    query: `?limit=50&page=1&status=published&type=latest${categoryParam}` as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Latest devotionals unavailable"
        message={res.error?.message ?? 'Failed to load devotionals'}
      />
    );
  }

  const latestDevotionals = ((res.data?.devotionals ?? []) as unknown[]).map(i =>
    mapToDailyDevotional(i as Record<string, unknown>)
  ) as DailyDevotional[];

  return <DailyDevotionalsSection devotionals={latestDevotionals} />;
}
