import { AllResourcesPageClient } from '@/components/section/community/resources/AllResourcesPageClient';
import { getAllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import { callPublicServerApi } from '@/lib/services/serverApi';
import {
  buildAllBrowseListQuery,
  parseAllBrowseQueryParams,
  type AllBrowseSearchParams,
} from '@/lib/utils/allBrowseQuery';
import { mapPublicResourceBrowseItem, parseResourceTypeFilter } from '@/lib/utils/resourceBrowse';

type AllResourcesSectionProps = {
  searchParams: AllBrowseSearchParams;
};

export async function AllResourcesSection({ searchParams }: AllResourcesSectionProps) {
  const config = getAllBrowseConfig('resource');
  const queryParams = parseAllBrowseQueryParams(searchParams);
  const activeType = parseResourceTypeFilter(searchParams.type);
  const query = buildAllBrowseListQuery(config, {
    ...queryParams,
    type: activeType !== 'all' ? activeType : undefined,
  });

  const res = await callPublicServerApi('PUBLIC_GET_RESOURCES', { query });

  if (res.type === 'error') {
    return (
      <AllResourcesPageClient
        config={config}
        items={[]}
        pagination={null}
        initialErrorMessage={res.error?.message ?? 'Failed to load resources'}
      />
    );
  }

  const items = (res.data?.resources ?? []).map(item =>
    mapPublicResourceBrowseItem(item as unknown as Record<string, unknown>)
  );

  return (
    <AllResourcesPageClient
      config={config}
      items={items}
      pagination={res.data?.pagination ?? null}
    />
  );
}
