import { AllDevotionalsPageClient } from '@/components/section/community/devotionals/AllDevotionalsPageClient';
import { getAllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import { callPublicServerApi } from '@/lib/services/serverApi';
import {
  buildAllBrowseListQuery,
  parseAllBrowseQueryParams,
  type AllBrowseSearchParams,
} from '@/lib/utils/allBrowseQuery';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { mapToDailyDevotional } from '@/lib/utils/communityApiMappers';
import type { DailyDevotional } from '@/components/section/community/devotionals/DevotionalsPageClient';

type AllDevotionalsSectionProps = {
  searchParams: AllBrowseSearchParams;
};

export async function AllDevotionalsSection({ searchParams }: AllDevotionalsSectionProps) {
  const config = getAllBrowseConfig('devotional');
  const category = await normalizePublicCategoryByScope('devotional', searchParams.category);
  const queryParams = parseAllBrowseQueryParams(searchParams);
  const query = buildAllBrowseListQuery(config, {
    ...queryParams,
    category: category !== 'all' ? category : undefined,
  });

  const res = await callPublicServerApi('PUBLIC_GET_DEVOTIONALS', { query });

  if (res.type === 'error') {
    return (
      <AllDevotionalsPageClient
        config={config}
        devotionals={[]}
        pagination={null}
        initialErrorMessage={res.error?.message ?? 'Failed to load devotionals'}
      />
    );
  }

  const devotionals = ((res.data?.devotionals ?? []) as unknown[]).map(item =>
    mapToDailyDevotional(item as Record<string, unknown>)
  ) as DailyDevotional[];

  return (
    <AllDevotionalsPageClient
      config={config}
      devotionals={devotionals}
      pagination={res.data?.pagination ?? null}
    />
  );
}
