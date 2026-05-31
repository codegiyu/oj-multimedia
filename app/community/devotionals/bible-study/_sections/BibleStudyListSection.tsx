import { BibleStudySeriesSection } from '@/components/section/community/devotionals/BibleStudySeriesSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { mapToBibleStudy } from '@/lib/utils/communityApiMappers';
import { buildBrowseListQuery } from '@/lib/utils/browsePage';
import type { BibleStudy } from '@/components/section/community/devotionals/DevotionalsPageClient';

type BibleStudyListSectionProps = {
  page: number;
};

export async function BibleStudyListSection({ page }: BibleStudyListSectionProps) {
  const query = buildBrowseListQuery({
    page,
    extra: { type: 'bible-study' },
  }) as `?${string}`;

  const res = await callPublicServerApi('PUBLIC_GET_DEVOTIONALS', { query }, ISR_PUBLIC_FETCH.slow);

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

  return (
    <BibleStudySeriesSection
      series={bibleStudySeries}
      presentation="browse-list"
      pagination={res.data?.pagination ?? null}
    />
  );
}
