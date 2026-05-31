import { DailyDevotionalsSection } from '@/components/section/community/devotionals/DailyDevotionalsSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToDailyDevotional } from '@/lib/utils/communityApiMappers';
import { buildBrowseListQuery } from '@/lib/utils/browsePage';
import type { DailyDevotional } from '@/components/section/community/devotionals/DevotionalsPageClient';

type LatestDevotionalsSectionProps = {
  category: string;
  page: number;
};

export async function LatestDevotionalsSection({ category, page }: LatestDevotionalsSectionProps) {
  const query = buildBrowseListQuery({
    page,
    extra: {
      type: 'latest',
      category: category && category !== 'all' ? category : undefined,
    },
  }) as `?${string}`;

  const res = await callPublicServerApi('PUBLIC_GET_DEVOTIONALS', { query });

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

  return (
    <DailyDevotionalsSection
      devotionals={latestDevotionals}
      presentation="browse-list"
      pagination={res.data?.pagination ?? null}
    />
  );
}
