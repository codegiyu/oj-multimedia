import { DailyDevotionalsSection } from '@/components/section/community/devotionals/DailyDevotionalsSection';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapToDailyDevotional } from '@/lib/utils/communityApiMappers';
import { buildCommunityListQuery } from '@/lib/utils/communityListQuery';
import type { DailyDevotional } from '@/components/section/community/devotionals/DevotionalsPageClient';

type PopularDevotionalsSectionProps = {
  category: string;
};

export async function PopularDevotionalsSection({ category }: PopularDevotionalsSectionProps) {
  const res = await callPublicServerApi('PUBLIC_GET_DEVOTIONALS', {
    query: buildCommunityListQuery({ type: 'popular', publishedOnly: true, category }),
  });

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

  return <DailyDevotionalsSection devotionals={popularDevotionals} />;
}
