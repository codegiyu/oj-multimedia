import { DailyDevotionalsSection } from '@/components/section/community/devotionals/DailyDevotionalsSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToDailyDevotional } from '@/lib/utils/communityApiMappers';
import { buildBrowseListQuery } from '@/lib/utils/browsePage';
import type { DailyDevotional } from '@/components/section/community/devotionals/DevotionalsPageClient';

type PopularDevotionalsSectionProps = {
  category: string;
  page: number;
};

export async function PopularDevotionalsSection({
  category,
  page,
}: PopularDevotionalsSectionProps) {
  const query = buildBrowseListQuery({
    page,
    extra: {
      type: 'popular',
      category: category && category !== 'all' ? category : undefined,
    },
  }) as `?${string}`;

  const res = await callPublicServerApi('PUBLIC_GET_DEVOTIONALS', { query });

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Popular devotionals unavailable"
        message={res.error?.message ?? 'Failed to load devotionals'}
      />
    );
  }

  const popularDevotionals = ((res.data?.devotionals ?? []) as unknown[]).map(i =>
    mapToDailyDevotional(i as Record<string, unknown>)
  ) as DailyDevotional[];

  return (
    <DailyDevotionalsSection
      devotionals={popularDevotionals}
      presentation="browse-list"
      pagination={res.data?.pagination ?? null}
    />
  );
}
