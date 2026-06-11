import { AllVideosPageClient } from '@/components/section/video/AllVideosPageClient';
import { getAllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { IPublicVideosListRes } from '@/lib/constants/endpoints';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { videoCategoryNavFallback } from '@/lib/constants/categoryNavFallbacks';
import { callPublicServerApi, type PublicServerApiConfig } from '@/lib/services/serverApi';
import {
  buildAllBrowseListQuery,
  parseAllBrowseQueryParams,
  type AllBrowseSearchParams,
} from '@/lib/utils/allBrowseQuery';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';
import { mapPublicVideoToRecentUpload } from '@/lib/utils/publicApiMappers';

type AllVideosSectionProps = {
  searchParams: AllBrowseSearchParams;
  fetchOptions?: PublicServerApiConfig;
};

export async function AllVideosSection({
  searchParams,
  fetchOptions = ISR_PUBLIC_FETCH.fast,
}: AllVideosSectionProps) {
  const config = getAllBrowseConfig('video');
  const category = await normalizePublicCategoryByScope(
    'video',
    searchParams.category,
    fetchOptions
  );
  const queryParams = parseAllBrowseQueryParams(searchParams);
  const query = buildAllBrowseListQuery(config, {
    ...queryParams,
    category: category !== 'all' ? category : undefined,
  });

  const [categoryOptions, res] = await Promise.all([
    fetchPublicCategoryNav('video', 'All Videos', videoCategoryNavFallback, fetchOptions),
    callPublicServerApi('PUBLIC_GET_VIDEOS', { query }, fetchOptions),
  ]);

  if (res.type === 'error') {
    return (
      <AllVideosPageClient
        config={config}
        categoryOptions={categoryOptions}
        videos={[]}
        pagination={null}
        initialErrorMessage={res.error?.message ?? 'Failed to load videos'}
      />
    );
  }

  const videos = ((res.data as IPublicVideosListRes)?.videos ?? []).map(
    mapPublicVideoToRecentUpload
  );

  return (
    <AllVideosPageClient
      config={config}
      categoryOptions={categoryOptions}
      videos={videos}
      pagination={res.data?.pagination ?? null}
    />
  );
}
