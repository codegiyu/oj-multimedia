import { AllNewsPageClient } from '@/components/section/news/AllNewsPageClient';
import { getAllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { IPublicNewsListRes } from '@/lib/constants/endpoints';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { newsCategoryNavFallback } from '@/lib/constants/categoryNavFallbacks';
import { callPublicServerApi, type PublicServerApiConfig } from '@/lib/services/serverApi';
import {
  buildAllBrowseListQuery,
  parseAllBrowseQueryParams,
  type AllBrowseSearchParams,
} from '@/lib/utils/allBrowseQuery';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';
import { filterPublicNewsList, mapPublicNewsToFeedItem } from '@/lib/utils/publicApiMappers';

type AllNewsSectionProps = {
  searchParams: AllBrowseSearchParams;
  fetchOptions?: PublicServerApiConfig;
};

export async function AllNewsSection({
  searchParams,
  fetchOptions = ISR_PUBLIC_FETCH.fast,
}: AllNewsSectionProps) {
  const config = getAllBrowseConfig('news');
  const category = await normalizePublicCategoryByScope(
    'news',
    searchParams.category,
    fetchOptions
  );
  const queryParams = parseAllBrowseQueryParams(searchParams);
  const query = buildAllBrowseListQuery(config, {
    ...queryParams,
    category: category !== 'all' ? category : undefined,
  });

  const [categoryOptions, res] = await Promise.all([
    fetchPublicCategoryNav('news', 'All Stories', newsCategoryNavFallback, fetchOptions),
    callPublicServerApi('PUBLIC_GET_NEWS', { query }, fetchOptions),
  ]);

  if (res.type === 'error') {
    return (
      <AllNewsPageClient
        config={config}
        categoryOptions={categoryOptions}
        newsItems={[]}
        pagination={null}
        initialErrorMessage={res.error?.message ?? 'Failed to load stories'}
      />
    );
  }

  const newsItems = filterPublicNewsList((res.data as IPublicNewsListRes)?.articles ?? []).map(
    mapPublicNewsToFeedItem
  );

  return (
    <AllNewsPageClient
      config={config}
      categoryOptions={categoryOptions}
      newsItems={newsItems}
      pagination={res.data?.pagination ?? null}
    />
  );
}
