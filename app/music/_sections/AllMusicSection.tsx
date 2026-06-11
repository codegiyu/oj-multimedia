import { AllMusicPageClient } from '@/components/section/music/AllMusicPageClient';
import { getAllBrowseConfig } from '@/lib/constants/allBrowseConfig';
import type { IPublicMusicListRes } from '@/lib/constants/endpoints';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { musicCategoryNavFallback } from '@/lib/constants/categoryNavFallbacks';
import { callPublicServerApi, type PublicServerApiConfig } from '@/lib/services/serverApi';
import {
  buildAllBrowseListQuery,
  parseAllBrowseQueryParams,
  type AllBrowseSearchParams,
} from '@/lib/utils/allBrowseQuery';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';
import { mapPublicMusicToTrendingSong } from '@/lib/utils/publicApiMappers';

type AllMusicSectionProps = {
  searchParams: AllBrowseSearchParams;
  fetchOptions?: PublicServerApiConfig;
};

export async function AllMusicSection({
  searchParams,
  fetchOptions = ISR_PUBLIC_FETCH.fast,
}: AllMusicSectionProps) {
  const config = getAllBrowseConfig('music');
  const category = await normalizePublicCategoryByScope(
    'music',
    searchParams.category,
    fetchOptions
  );
  const queryParams = parseAllBrowseQueryParams(searchParams);
  const query = buildAllBrowseListQuery(config, {
    ...queryParams,
    category: category !== 'all' ? category : undefined,
  });

  const [categoryOptions, res] = await Promise.all([
    fetchPublicCategoryNav('music', 'All Genres', musicCategoryNavFallback, fetchOptions),
    callPublicServerApi('PUBLIC_GET_MUSIC', { query }, fetchOptions),
  ]);

  if (res.type === 'error') {
    return (
      <AllMusicPageClient
        config={config}
        categoryOptions={categoryOptions}
        songs={[]}
        pagination={null}
        initialErrorMessage={res.error?.message ?? 'Failed to load music'}
      />
    );
  }

  const songs = ((res.data as IPublicMusicListRes)?.music ?? []).map(mapPublicMusicToTrendingSong);

  return (
    <AllMusicPageClient
      config={config}
      categoryOptions={categoryOptions}
      songs={songs}
      pagination={res.data?.pagination ?? null}
    />
  );
}
