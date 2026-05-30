import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MusicHero } from '@/components/section/music/MusicHero';
import { MusicPageClient } from '@/components/section/music/MusicPageClient';
import { MusicHubPageSkeleton } from '@/components/section/music/MusicPageSkeleton';
import type { TrendingSong } from '@/components/section/music/TrendingSongs';
import type { ChartSong } from '@/components/section/music/TopMusicCharts';
import type { RecentUpload } from '@/components/section/music/RecentUploads';
import type { FeaturedArtist } from '@/components/section/music/FeaturedArtists';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { CHART_PERIOD_VALUES, MUSIC_TYPES } from '@/lib/constants/contentTaxonomy';
import { filterByCategory } from '@/lib/utils/music';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { fetchPublicCategoryNav } from '@/lib/utils/contentCategoryNav';
import { musicCategoryNavFallback } from '@/lib/constants/categoryNavFallbacks';
import {
  filterPublicMusicList,
  filterPublicAlbumList,
  mapPublicMusicToTrendingSong,
  mapPublicMusicToChartSong,
  mapPublicMusicToRecentUpload,
  mapPublicArtistToFeaturedArtist,
  mapPublicAlbumToCard,
} from '@/lib/utils/publicApiMappers';
import type { IPublicAlbumsListRes } from '@/lib/constants/endpoints';

export const metadata: Metadata = {
  title: 'Music - Latest Songs & Downloads',
  description:
    'Discover the latest music across multiple categories, download MP3s, watch music videos, explore artist profiles, and check out top charts and download metrics.',
};

async function fetchMusicSections(category: string, period: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const baseQuery = `?limit=12&page=1&status=published${categoryParam}`;

  const [trendingRes, chartsRes, recentRes, artistsRes, albumsRes] = await Promise.all([
    callPublicServerApi('PUBLIC_GET_MUSIC', {
      query: `${baseQuery}&type=${MUSIC_TYPES.trending}` as `?${string}`,
    }),
    callPublicServerApi('PUBLIC_GET_MUSIC', {
      query: `${baseQuery}&type=${MUSIC_TYPES.charts}&period=${period}` as `?${string}`,
    }),
    callPublicServerApi('PUBLIC_GET_MUSIC', {
      query: `${baseQuery}&type=${MUSIC_TYPES.recent}` as `?${string}`,
    }),
    callPublicServerApi('PUBLIC_GET_ARTISTS', { query: '?page=1&limit=6' as `?${string}` }),
    callPublicServerApi('PUBLIC_GET_ALBUMS', {
      query: '?limit=12&page=1&type=featured' as `?${string}`,
    }),
  ]);

  let errorMessage: string | null = null;
  if (trendingRes.type === 'error')
    errorMessage = trendingRes.error?.message ?? 'Failed to load music';
  else if (chartsRes.type === 'error')
    errorMessage = chartsRes.error?.message ?? 'Failed to load charts';
  else if (recentRes.type === 'error')
    errorMessage = recentRes.error?.message ?? 'Failed to load recent';

  const rawTrending = filterPublicMusicList(
    trendingRes.type === 'success' ? (trendingRes.data?.music ?? []) : []
  );
  const rawCharts = filterPublicMusicList(
    chartsRes.type === 'success' ? (chartsRes.data?.music ?? []) : []
  );
  const rawRecent = filterPublicMusicList(
    recentRes.type === 'success' ? (recentRes.data?.music ?? []) : []
  );

  const trendingSongs: TrendingSong[] = filterByCategory(
    rawTrending.map(mapPublicMusicToTrendingSong),
    category
  ).slice(0, 8);

  const chartSongs: ChartSong[] = filterByCategory(
    rawCharts.map((item, i) => mapPublicMusicToChartSong(item, i + 1)),
    category
  ).slice(0, 10);

  const recentUploads: RecentUpload[] = filterByCategory(rawRecent, category)
    .map(mapPublicMusicToRecentUpload)
    .slice(0, 6);

  const rawArtists = artistsRes.type === 'success' ? (artistsRes.data?.artists ?? []) : [];
  const featuredArtists: FeaturedArtist[] = rawArtists
    .slice(0, 6)
    .map(a => mapPublicArtistToFeaturedArtist(a as unknown as Record<string, unknown>));

  const featuredAlbums =
    albumsRes.type === 'success'
      ? filterPublicAlbumList((albumsRes.data as IPublicAlbumsListRes)?.albums ?? []).map(
          mapPublicAlbumToCard
        )
      : [];

  return {
    trendingSongs,
    chartSongs,
    recentUploads,
    featuredArtists,
    featuredAlbums,
    initialErrorMessage: errorMessage,
  };
}

interface MusicPageProps {
  searchParams: Promise<{ category?: string; period?: string }>;
}

export default async function MusicPage({ searchParams }: MusicPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope('music', params.category);
  const period = CHART_PERIOD_VALUES.includes(
    (params.period ?? 'weekly') as (typeof CHART_PERIOD_VALUES)[number]
  )
    ? (params.period ?? 'weekly')
    : 'weekly';

  return (
    <MainLayout>
      <MusicHero />
      <Suspense fallback={<MusicHubPageSkeleton />}>
        <MusicPageServer category={category} period={period} />
      </Suspense>
    </MainLayout>
  );
}

async function MusicPageServer({ category, period }: { category: string; period: string }) {
  const [data, categoryOptions] = await Promise.all([
    fetchMusicSections(category, period),
    fetchPublicCategoryNav('music', 'All Genres', musicCategoryNavFallback),
  ]);

  return <MusicPageClient {...data} categoryOptions={categoryOptions} />;
}
