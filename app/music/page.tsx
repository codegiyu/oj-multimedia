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
import { ARTIST_PROFILES } from '@/lib/constants/community/artists';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import type { IPublicMusicListRes } from '@/lib/constants/endpoints';
import { filterByCategory } from '@/lib/utils/music';
import {
  mapPublicMusicToTrendingSong,
  mapPublicMusicToChartSong,
  mapPublicMusicToRecentUpload,
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

  const [trendingRes, chartsRes, recentRes] = await Promise.all([
    callServerApi('PUBLIC_GET_MUSIC', { query: `${baseQuery}&type=trending` as `?${string}` }),
    callServerApi('PUBLIC_GET_MUSIC', {
      query: `${baseQuery}&type=charts&period=${period}` as `?${string}`,
    }),
    callServerApi('PUBLIC_GET_MUSIC', { query: `${baseQuery}&type=recent` as `?${string}` }),
  ]);

  let errorMessage: string | null = null;
  if (trendingRes.error)
    errorMessage = (trendingRes.error as ApiErrorResponse)?.message ?? 'Failed to load music';
  else if (chartsRes.error)
    errorMessage = (chartsRes.error as ApiErrorResponse)?.message ?? 'Failed to load charts';
  else if (recentRes.error)
    errorMessage = (recentRes.error as ApiErrorResponse)?.message ?? 'Failed to load recent';

  const trendingData = trendingRes.data as IPublicMusicListRes | undefined;
  const chartsData = chartsRes.data as IPublicMusicListRes | undefined;
  const recentData = recentRes.data as IPublicMusicListRes | undefined;

  const rawTrending = trendingData?.music ?? [];
  const rawCharts = chartsData?.music ?? [];
  const rawRecent = recentData?.music ?? [];

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

  const featuredArtists: FeaturedArtist[] = ARTIST_PROFILES.filter(p => p.isFeatured)
    .slice(0, 6)
    .map(p => ({
      _id: p._id,
      name: p.name,
      genre: p.genre ?? '',
      image: p.image ?? '',
      followers: p.followers ?? '0',
      verified: p.verified ?? false,
      songs: p.songs ?? 0,
    }));

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
