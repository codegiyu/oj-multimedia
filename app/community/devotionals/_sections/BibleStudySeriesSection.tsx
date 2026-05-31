import { BibleStudySeriesSection as BibleStudySeries } from '@/components/section/community/devotionals/BibleStudySeriesSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToBibleStudy } from '@/lib/utils/communityApiMappers';
import type { BibleStudy } from '@/components/section/community/devotionals/DevotionalsPageClient';
import { DEVOTIONALS_BASE_QUERY } from '../../_sections/shared';

export async function BibleStudySeriesSection() {
  const res = await callPublicServerApi('PUBLIC_GET_DEVOTIONALS', {
    query: `${DEVOTIONALS_BASE_QUERY}&type=bible-study` as `?${string}`,
  });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Bible study series unavailable"
        message={res.error?.message ?? 'Failed to load bible study series'}
      />
    );
  }

  const bibleStudySeries = ((res.data?.devotionals ?? []) as unknown[]).map(i =>
    mapToBibleStudy(i as Record<string, unknown>)
  ) as BibleStudy[];

  return <BibleStudySeries series={bibleStudySeries} />;
}
