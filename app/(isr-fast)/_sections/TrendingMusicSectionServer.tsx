import { TrendingMusicSection } from '@/components/section/home';
import { SectionLoadError } from '@/components/general/SectionLoadError';
import type { IPublicMusicListRes } from '@/lib/constants/endpoints';
import { ALL_CATEGORY_ID } from '@/lib/constants/contentTaxonomy';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { mapPublicMusicToHomeTrending } from '@/lib/utils/homeTrendingMappers';
import { HOME_ISR, getMusicCategoryNavForHome } from './shared';

interface TrendingMusicSectionServerProps {
  musicCategorySlug: string;
}

export async function TrendingMusicSectionServer({
  musicCategorySlug,
}: TrendingMusicSectionServerProps) {
  const categorySlug = musicCategorySlug === ALL_CATEGORY_ID ? null : musicCategorySlug;
  const query = new URLSearchParams({
    limit: '12',
    page: '1',
    status: 'published',
    type: 'trending',
  });

  if (categorySlug) query.set('category', categorySlug);

  const res = await callPublicServerApi(
    'PUBLIC_GET_MUSIC',
    { query: `?${query.toString()}` },
    HOME_ISR
  );

  if (res.type === 'error') {
    return (
      <SectionLoadError
        title="Trending music unavailable"
        message={res.error?.message ?? 'Failed to load trending music'}
      />
    );
  }

  const music = ((res.data as IPublicMusicListRes | undefined)?.music ?? []).map(
    mapPublicMusicToHomeTrending
  );

  let categoryOptions: Awaited<ReturnType<typeof getMusicCategoryNavForHome>> = [];

  try {
    categoryOptions = await getMusicCategoryNavForHome();
  } catch {
    categoryOptions = [];
  }

  return <TrendingMusicSection music={music} categoryOptions={categoryOptions} />;
}
