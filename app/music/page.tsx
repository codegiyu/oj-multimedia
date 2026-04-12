import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MusicHero } from '@/components/section/music/MusicHero';
import { MusicPageClient } from '@/components/section/music/MusicPageClient';
import { MusicPageSkeleton } from '@/components/section/music/MusicPageSkeleton';
import type { TrendingSong } from '@/components/section/music/TrendingSongs';
import type { ChartSong } from '@/components/section/music/TopMusicCharts';
import type { RecentUpload } from '@/components/section/music/RecentUploads';
import type { FeaturedArtist } from '@/components/section/music/FeaturedArtists';
import { callServerApi } from '@/lib/services/serverApi';
import { filterByCategory } from '@/lib/utils/music';
import {
  mapPublicMusicToTrendingSong,
  mapPublicMusicToChartSong,
  mapPublicMusicToRecentUpload,
  mapPublicArtistToFeaturedArtist,
} from '@/lib/utils/publicApiMappers';

export const metadata: Metadata = {
  title: 'Music - Latest Songs & Downloads',
  description:
    'Discover the latest music across multiple categories, download MP3s, watch music videos, explore artist profiles, and check out top charts and download metrics.',
};

export const dynamic = 'force-dynamic';

async function fetchMusicSections(category: string, period: string) {
  const categoryParam =
    category && category !== 'all' ? `&category=${encodeURIComponent(category)}` : '';
  const baseQuery = `?limit=12&page=1&status=published${categoryParam}`;

  const [trendingRes, chartsRes, recentRes, artistsRes] = await Promise.all([
    callServerApi('PUBLIC_GET_MUSIC', { query: `${baseQuery}&type=trending` as `?${string}` }),
    callServerApi('PUBLIC_GET_MUSIC', {
      query: `${baseQuery}&type=charts&period=${period}` as `?${string}`,
    }),
    callServerApi('PUBLIC_GET_MUSIC', { query: `${baseQuery}&type=recent` as `?${string}` }),
    callServerApi('PUBLIC_GET_ARTISTS', { query: '?page=1&limit=6' as `?${string}` }),
  ]);

  let errorMessage: string | null = null;
  if (trendingRes.type === 'error')
    errorMessage = trendingRes.error?.message ?? 'Failed to load music';
  else if (chartsRes.type === 'error')
    errorMessage = chartsRes.error?.message ?? 'Failed to load charts';
  else if (recentRes.type === 'error')
    errorMessage = recentRes.error?.message ?? 'Failed to load recent';

  const rawTrending = trendingRes.type === 'success' ? (trendingRes.data?.music ?? []) : [];
  const rawCharts = chartsRes.type === 'success' ? (chartsRes.data?.music ?? []) : [];
  const rawRecent = recentRes.type === 'success' ? (recentRes.data?.music ?? []) : [];

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

  return {
    trendingSongs,
    chartSongs,
    recentUploads,
    featuredArtists,
    initialErrorMessage: errorMessage,
  };
}

interface MusicPageProps {
  searchParams: Promise<{ category?: string; period?: string }>;
}

export default async function MusicPage({ searchParams }: MusicPageProps) {
  const params = await searchParams;
  const category = params.category ?? 'all';
  const period = params.period ?? 'weekly';

  return (
    <MainLayout>
      <MusicHero />
      <Suspense fallback={<MusicPageSkeleton />}>
        <MusicPageServer category={category} period={period} />
      </Suspense>
    </MainLayout>
  );
}

async function MusicPageServer({ category, period }: { category: string; period: string }) {
  const data = await fetchMusicSections(category, period);
  return <MusicPageClient {...data} />;
}
