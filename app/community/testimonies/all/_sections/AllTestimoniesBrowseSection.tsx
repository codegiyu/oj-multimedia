import { AllTestimoniesPageClient } from '@/components/section/community/testimonies/AllTestimoniesPageClient';
import { getAllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import { callPublicServerApi } from '@/lib/services/serverApi';
import {
  buildAllBrowseListQuery,
  parseAllBrowseQueryParams,
  type AllBrowseSearchParams,
} from '@/lib/utils/allBrowseQuery';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { mapToTestimony } from '@/lib/utils/communityApiMappers';
import type { Testimony } from '@/components/section/community/testimonies/TestimoniesPageClient';

type AllTestimoniesBrowseSectionProps = {
  searchParams: AllBrowseSearchParams;
};

export async function AllTestimoniesBrowseSection({
  searchParams,
}: AllTestimoniesBrowseSectionProps) {
  const config = getAllBrowseConfig('testimony');
  const category = await normalizePublicCategoryByScope('testimony', searchParams.category);
  const queryParams = parseAllBrowseQueryParams(searchParams);
  const query = buildAllBrowseListQuery(config, {
    ...queryParams,
    category: category !== 'all' ? category : undefined,
  });

  const res = await callPublicServerApi('PUBLIC_GET_TESTIMONIES', { query });

  if (res.type === 'error') {
    return (
      <AllTestimoniesPageClient
        config={config}
        testimonies={[]}
        pagination={null}
        initialErrorMessage={res.error?.message ?? 'Failed to load testimonies'}
      />
    );
  }

  const testimonies = ((res.data?.testimonies ?? []) as unknown[]).map(item =>
    mapToTestimony(item as Record<string, unknown>)
  ) as Testimony[];

  return (
    <AllTestimoniesPageClient
      config={config}
      testimonies={testimonies}
      pagination={res.data?.pagination ?? null}
    />
  );
}
