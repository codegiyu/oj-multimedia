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

export const metadata: Metadata = {
  title: 'Music - Latest Songs & Downloads',
  description:
    'Discover the latest music across multiple categories, download MP3s, watch music videos, explore artist profiles, and check out top charts and download metrics.',
};

// Generate music data (in a real app, this would come from an API or database)
async function generateMusicData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  const trendingSongs: TrendingSong[] = [
    {
      id: 1,
      title: 'Sunset Vibes',
      artist: 'DJ Flame',
      cover: '/images/album-1.jpg',
      plays: '2.4M',
      duration: '3:45',
      isNew: true,
    },
    {
      id: 2,
      title: 'City Lights',
      artist: 'Luna Belle',
      cover: '/images/album-2.jpg',
      plays: '1.8M',
      duration: '4:12',
      isNew: false,
    },
    {
      id: 3,
      title: 'Midnight Dreams',
      artist: 'The Wave',
      cover: '/images/album-3.jpg',
      plays: '1.2M',
      duration: '3:28',
      isNew: true,
    },
    {
      id: 4,
      title: 'Electric Soul',
      artist: 'Marcus Jay',
      cover: '/images/artist-1.jpg',
      plays: '980K',
      duration: '3:55',
      isNew: false,
    },
    {
      id: 5,
      title: 'Golden Hour',
      artist: 'Aria Rose',
      cover: '/images/artist-2.jpg',
      plays: '756K',
      duration: '4:08',
      isNew: false,
    },
    {
      id: 6,
      title: 'Street Dreams',
      artist: 'King Vibe',
      cover: '/images/artist-3.jpg',
      plays: '654K',
      duration: '3:32',
      isNew: true,
    },
    {
      id: 7,
      title: 'Ocean Waves',
      artist: 'Crystal',
      cover: '/images/album-1.jpg',
      plays: '543K',
      duration: '3:18',
      isNew: false,
    },
    {
      id: 8,
      title: 'Neon Nights',
      artist: 'Summer',
      cover: '/images/album-2.jpg',
      plays: '432K',
      duration: '3:50',
      isNew: false,
    },
  ];

  const chartSongs: ChartSong[] = [
    {
      rank: 1,
      title: 'Sunset Vibes',
      artist: 'DJ Flame',
      cover: '/images/album-1.jpg',
      plays: '2.4M',
      trend: 'up',
      change: 12,
    },
    {
      rank: 2,
      title: 'City Lights',
      artist: 'Luna Belle',
      cover: '/images/album-2.jpg',
      plays: '1.8M',
      trend: 'up',
      change: 8,
    },
    {
      rank: 3,
      title: 'Midnight Dreams',
      artist: 'The Wave',
      cover: '/images/album-3.jpg',
      plays: '1.2M',
      trend: 'same',
      change: 0,
    },
    {
      rank: 4,
      title: 'Electric Soul',
      artist: 'Marcus Jay',
      cover: '/images/artist-1.jpg',
      plays: '980K',
      trend: 'down',
      change: 3,
    },
    {
      rank: 5,
      title: 'Golden Hour',
      artist: 'Aria Rose',
      cover: '/images/artist-2.jpg',
      plays: '756K',
      trend: 'up',
      change: 15,
    },
    {
      rank: 6,
      title: 'Street Dreams',
      artist: 'King Vibe',
      cover: '/images/artist-3.jpg',
      plays: '654K',
      trend: 'up',
      change: 5,
    },
    {
      rank: 7,
      title: 'Neon Nights',
      artist: 'Crystal',
      cover: '/images/album-1.jpg',
      plays: '543K',
      trend: 'down',
      change: 2,
    },
    {
      rank: 8,
      title: 'Ocean Breeze',
      artist: 'Summer',
      cover: '/images/album-2.jpg',
      plays: '432K',
      trend: 'up',
      change: 20,
    },
    {
      rank: 9,
      title: 'Rhythm Flow',
      artist: 'Beat Master',
      cover: '/images/album-3.jpg',
      plays: '398K',
      trend: 'up',
      change: 11,
    },
    {
      rank: 10,
      title: 'Dancing Stars',
      artist: 'Nova',
      cover: '/images/artist-1.jpg',
      plays: '356K',
      trend: 'same',
      change: 0,
    },
  ];

  const recentUploads: RecentUpload[] = [
    {
      id: 1,
      title: 'Morning Light',
      artist: 'Sarah Grace',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      uploadedAt: '2 hours ago',
      genre: 'Acoustic',
    },
    {
      id: 2,
      title: 'Urban Flow',
      artist: 'Metro Kid',
      cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      uploadedAt: '4 hours ago',
      genre: 'Hip-Hop',
    },
    {
      id: 3,
      title: 'Peaceful Mind',
      artist: 'Zen Beats',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      uploadedAt: '6 hours ago',
      genre: 'Instrumental',
    },
    {
      id: 4,
      title: 'Rise Up',
      artist: 'Victory Sound',
      cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      uploadedAt: '8 hours ago',
      genre: 'Inspirational',
    },
    {
      id: 5,
      title: 'Summer Feels',
      artist: 'Beach Vibes',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      uploadedAt: '12 hours ago',
      genre: 'Pop',
    },
    {
      id: 6,
      title: 'Heart & Soul',
      artist: 'Melody Grace',
      cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      uploadedAt: '1 day ago',
      genre: 'R&B',
    },
  ];

  const featuredArtists: FeaturedArtist[] = [
    {
      id: 1,
      name: 'DJ Flame',
      genre: 'Afrobeats',
      image: '/images/artist-1.jpg',
      followers: '125K',
      verified: true,
      songs: 45,
    },
    {
      id: 2,
      name: 'Luna Belle',
      genre: 'Pop',
      image: '/images/artist-2.jpg',
      followers: '98K',
      verified: true,
      songs: 32,
    },
    {
      id: 3,
      name: 'Marcus Jay',
      genre: 'Hip-Hop',
      image: '/images/artist-1.jpg',
      followers: '87K',
      verified: false,
      songs: 28,
    },
    {
      id: 4,
      name: 'Aria Rose',
      genre: 'R&B',
      image: '/images/album-1.jpg',
      followers: '76K',
      verified: true,
      songs: 41,
    },
    {
      id: 5,
      name: 'The Wave',
      genre: 'Instrumental',
      image: '/images/album-2.jpg',
      followers: '64K',
      verified: false,
      songs: 53,
    },
    {
      id: 6,
      name: 'King Vibe',
      genre: 'Gospel',
      image: '/images/artist-3.jpg',
      followers: '58K',
      verified: true,
      songs: 22,
    },
  ];

  return {
    trendingSongs,
    chartSongs,
    recentUploads,
    featuredArtists,
  };
}

export default async function NewMusicPage() {
  const musicData = await generateMusicData();

  return (
    <MainLayout>
      <MusicHero />
      <Suspense fallback={<MusicPageSkeleton />}>
        <MusicPageClient {...musicData} />
      </Suspense>
    </MainLayout>
  );
}
