import { BibleStudySeriesSection } from '@/components/section/community/devotionals/BibleStudySeriesSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapToBibleStudy } from '@/lib/utils/communityApiMappers';
import { buildCommunityListQuery } from '@/lib/utils/communityListQuery';
import type { BibleStudy } from '@/components/section/community/devotionals/DevotionalsPageClient';

export async function BibleStudyListSection() {
  const res = await callPublicServerApi(
    'PUBLIC_GET_DEVOTIONALS',
    {
      query: buildCommunityListQuery({ type: 'bible-study', publishedOnly: true }),
    },
    ISR_PUBLIC_FETCH.slow
  );

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

  return <BibleStudySeriesSection series={bibleStudySeries} />;
}
