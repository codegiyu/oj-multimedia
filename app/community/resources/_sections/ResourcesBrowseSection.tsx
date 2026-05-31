import { ResourcesBrowsePageClient } from '@/components/section/community/resources/ResourcesBrowsePageClient';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import { callPublicServerApi } from '@/lib/services/serverApi';
import {
  buildResourceBrowseQuery,
  mapPublicResourceBrowseItem,
  parseResourceTypeFilter,
} from '@/lib/utils/resourceBrowse';
import type { ResourceTypeCounts } from '@/components/section/community/resources/ResourceTypeFilterBar';

type ResourcesBrowseSectionProps = {
  page: number;
  typeParam?: string;
};

const EMPTY_COUNTS: ResourceTypeCounts = {
  all: 0,
  byType: {
    ebook: 0,
    template: 0,
    beat: 0,
    wallpaper: 0,
    affiliate: 0,
  },
};

export async function ResourcesBrowseSection({ page, typeParam }: ResourcesBrowseSectionProps) {
  const activeType = parseResourceTypeFilter(typeParam);
  const listQuery = buildResourceBrowseQuery(page, activeType);

  const [countsRes, listRes] = await Promise.all([
    callPublicServerApi('PUBLIC_GET_RESOURCE_COUNTS', {}),
    callPublicServerApi('PUBLIC_GET_RESOURCES', { query: listQuery }),
  ]);

  if (listRes.type === 'error') {
    return (
      <SectionLoadError
        title="Resources unavailable"
        message={listRes.error?.message ?? 'Failed to load resources'}
      />
    );
  }

  const counts: ResourceTypeCounts =
    countsRes.type === 'success' && countsRes.data
      ? {
          all: countsRes.data.all ?? 0,
          byType: {
            ebook: countsRes.data.byType?.ebook ?? 0,
            template: countsRes.data.byType?.template ?? 0,
            beat: countsRes.data.byType?.beat ?? 0,
            wallpaper: countsRes.data.byType?.wallpaper ?? 0,
            affiliate: countsRes.data.byType?.affiliate ?? 0,
          },
        }
      : EMPTY_COUNTS;

  const rawItems = listRes.data?.resources ?? [];
  const items = rawItems.map(item =>
    mapPublicResourceBrowseItem(item as unknown as Record<string, unknown>)
  );

  return (
    <ResourcesBrowsePageClient
      items={items}
      activeType={activeType}
      counts={counts}
      pagination={listRes.data?.pagination ?? null}
      initialErrorMessage={countsRes.type === 'error' ? countsRes.error?.message : null}
    />
  );
}
