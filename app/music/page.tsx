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
import { MUSIC_ITEMS } from '@/lib/constants/music';
import { filterByCategory } from '@/lib/utils/music';
import { populateArtist } from '@/lib/utils/community/artists';

export const metadata: Metadata = {
  title: 'Music - Latest Songs & Downloads',
  description:
    'Discover the latest music across multiple categories, download MP3s, watch music videos, explore artist profiles, and check out top charts and download metrics.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate music data from central constants
async function generateMusicData(category: string = 'all', period: string = 'weekly') {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Filter MUSIC_ITEMS by category first
  const filteredItems = filterByCategory(MUSIC_ITEMS, category);

  // Filter and transform trending songs (limit to 8); artist populated to { _id, name }
  const trendingSongs: TrendingSong[] = filteredItems
    .filter(item => item.isTrending && item.plays !== undefined && item.duration !== undefined)
    .slice(0, 8)
    .map(item => {
      const artist = populateArtist(item.artist) ?? { _id: item.artist, name: 'Unknown' };
      return {
        _id: item._id,
        title: item.title,
        artist,
        cover: item.cover,
        plays: item.plays!,
        duration: item.duration!,
        isNew: item.isNew || false,
      };
    });

  // Filter and transform chart songs by period (limit to 10, sorted by rank); artist populated
  const chartSongs: ChartSong[] = filteredItems
    .filter(
      item =>
        item.isChart &&
        item.rank !== undefined &&
        item.trend !== undefined &&
        (item.chartPeriod || 'weekly') === period
    )
    .sort((a, b) => (a.rank || 0) - (b.rank || 0))
    .slice(0, 10)
    .map(item => {
      const artist = populateArtist(item.artist) ?? { _id: item.artist, name: 'Unknown' };
      return {
        _id: item._id,
        rank: item.rank!,
        title: item.title,
        artist,
        cover: item.cover,
        plays: item.plays || '0',
        trend: item.trend!,
        change: item.change || 0,
      };
    });

  // Filter and transform recent uploads (limit to 6); artist populated
  const recentUploads: RecentUpload[] = filteredItems
    .filter(item => item.isRecent && item.uploadedAt !== undefined && item.genre !== undefined)
    .slice(0, 6)
    .map(item => {
      const artist = populateArtist(item.artist) ?? { _id: item.artist, name: 'Unknown' };
      return {
        _id: item._id,
        title: item.title,
        artist,
        cover: item.cover,
        uploadedAt: item.uploadedAt!,
        genre: item.genre!,
      };
    });

  // Featured artists from ARTIST_PROFILES (limit to 6)
  const featuredArtists: FeaturedArtist[] = ARTIST_PROFILES.filter(p => p.isFeatured)
    .slice(0, 6)
    .map(p => ({
      _id: p._id,
      name: p.name,
      genre: p.genre ?? '',
      image: p.image,
      followers: p.followers ?? '0',
      verified: p.verified ?? false,
      songs: p.songs ?? 0,
    }));

  return {
    trendingSongs,
    chartSongs,
    recentUploads,
    featuredArtists,
  };
}

interface MusicPageProps {
  searchParams: Promise<{ category?: string; period?: string }>;
}

export default async function NewMusicPage({ searchParams }: MusicPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const period = params.period || 'weekly';
  const musicData = await generateMusicData(category, period);

  return (
    <MainLayout>
      <MusicHero />
      <Suspense fallback={<MusicPageSkeleton />}>
        <MusicPageClient {...musicData} />
      </Suspense>
    </MainLayout>
  );
}
