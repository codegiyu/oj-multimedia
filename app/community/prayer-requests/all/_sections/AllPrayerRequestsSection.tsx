import { AllPrayerRequestsPageClient } from '@/components/section/community/prayer-requests/AllPrayerRequestsPageClient';
import { getAllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import { callPublicServerApi } from '@/lib/services/serverApi';
import {
  buildAllBrowseListQuery,
  parseAllBrowseQueryParams,
  type AllBrowseSearchParams,
} from '@/lib/utils/allBrowseQuery';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { mapToAnsweredPrayer, mapToPrayerRequest } from '@/lib/utils/communityApiMappers';
import type {
  AnsweredPrayer,
  PrayerRequest,
} from '@/components/section/community/prayer-requests/PrayerRequestsPageClient';

type AllPrayerRequestsSectionProps = {
  searchParams: AllBrowseSearchParams;
};

export async function AllPrayerRequestsSection({ searchParams }: AllPrayerRequestsSectionProps) {
  const config = getAllBrowseConfig('prayer-request');
  const category = await normalizePublicCategoryByScope('prayer-request', searchParams.category);
  const queryParams = parseAllBrowseQueryParams(searchParams);
  const status = searchParams.status?.trim() || 'all';
  const listKind = status === 'answered' ? 'answered' : 'active';
  const query = buildAllBrowseListQuery(config, {
    ...queryParams,
    category: category !== 'all' ? category : undefined,
    status: status !== 'all' ? status : undefined,
  });

  const res = await callPublicServerApi('PUBLIC_GET_PRAYER_REQUESTS', { query });

  if (res.type === 'error') {
    return (
      <AllPrayerRequestsPageClient
        config={config}
        listKind={listKind}
        activeRequests={[]}
        answeredPrayers={[]}
        pagination={null}
        initialErrorMessage={res.error?.message ?? 'Failed to load prayer requests'}
      />
    );
  }

  const rawItems = (res.data?.prayerRequests ?? []) as unknown[];

  if (listKind === 'answered') {
    const answeredPrayers = rawItems.map(item =>
      mapToAnsweredPrayer(item as Record<string, unknown>)
    ) as AnsweredPrayer[];

    return (
      <AllPrayerRequestsPageClient
        config={config}
        listKind="answered"
        activeRequests={[]}
        answeredPrayers={answeredPrayers}
        pagination={res.data?.pagination ?? null}
      />
    );
  }

  const activeRequests = rawItems.map(item =>
    mapToPrayerRequest(item as Record<string, unknown>)
  ) as PrayerRequest[];

  return (
    <AllPrayerRequestsPageClient
      config={config}
      listKind="active"
      activeRequests={activeRequests}
      answeredPrayers={[]}
      pagination={res.data?.pagination ?? null}
    />
  );
}
