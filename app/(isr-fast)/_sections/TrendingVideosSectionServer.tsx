import { TrendingVideosSection } from '@/components/section/home';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { IPublicVideosListRes } from '@/lib/constants/endpoints';
import { ALL_CATEGORY_ID } from '@/lib/constants/contentTaxonomy';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicVideoToHomeTrending } from '@/lib/utils/homeTrendingMappers';
import { HOME_ISR, getVideoCategoryNavForHome } from './shared';

interface TrendingVideosSectionServerProps {
  videoCategorySlug: string;
}

export async function TrendingVideosSectionServer({
  videoCategorySlug,
}: TrendingVideosSectionServerProps) {
  const categorySlug = videoCategorySlug === ALL_CATEGORY_ID ? null : videoCategorySlug;
  const query = new URLSearchParams({
    limit: '12',
    page: '1',
    status: 'published',
    type: 'trending',
  });

  if (categorySlug) query.set('category', categorySlug);

  const res = await callPublicServerApi(
    'PUBLIC_GET_VIDEOS',
    { query: `?${query.toString()}` },
    HOME_ISR
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Trending videos unavailable"
        message={res.error?.message ?? 'Failed to load trending videos'}
      />
    );
  }

  const videos = ((res.data as IPublicVideosListRes | undefined)?.videos ?? []).map(
    mapPublicVideoToHomeTrending
  );

  let categoryOptions: Awaited<ReturnType<typeof getVideoCategoryNavForHome>> = [];

  try {
    categoryOptions = await getVideoCategoryNavForHome();
  } catch {
    categoryOptions = [];
  }

  return <TrendingVideosSection videos={videos} categoryOptions={categoryOptions} />;
}
