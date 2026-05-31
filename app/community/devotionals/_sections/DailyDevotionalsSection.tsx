import { DailyDevotionalsSection as DailyDevotionals } from '@/components/section/community/devotionals/DailyDevotionalsSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToDailyDevotional } from '@/lib/utils/communityApiMappers';
import type { DailyDevotional } from '@/components/section/community/devotionals/DevotionalsPageClient';
import { DEVOTIONALS_BASE_QUERY } from '../../_sections/shared';

export async function DailyDevotionalsSection() {
  const res = await callPublicServerApi('PUBLIC_GET_DEVOTIONALS', {
    query: `${DEVOTIONALS_BASE_QUERY}&type=daily` as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Daily devotionals unavailable"
        message={res.error?.message ?? 'Failed to load daily devotionals'}
      />
    );
  }

  const dailyDevotionals = ((res.data?.devotionals ?? []) as unknown[]).map(i =>
    mapToDailyDevotional(i as Record<string, unknown>)
  ) as DailyDevotional[];

  return <DailyDevotionals devotionals={dailyDevotionals} />;
}
