import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/section/home/HeroSection';
import { HomePageClient } from '@/components/section/home/HomePageClient';
import { HomePageSkeleton } from '@/components/section/home/HomePageSkeleton';
import type {
  TrendingMusicItem,
  TrendingVideoItem,
  ChartItem,
  RisingArtist,
  NewsArticle,
  MarketplaceProduct,
  CommunityPost,
  PollOption,
} from '@/components/section/home';
import {
  getTrendingMusicForHome,
  getChartDataForHome,
  getRisingArtistsForHome,
} from '@/lib/utils/music';
import { getTrendingVideosForHome } from '@/lib/utils/videos';
import { getNewsArticlesForHome } from '@/lib/utils/news';

export const metadata = {
  title: 'Home - Discover Music, Charts & Latest Content',
  description:
    'Explore our dynamic homepage featuring music categories, top charts, recent uploads, download metrics, trending content, and discover new music and audio content. Stay engaged with our lively, ever-updating platform.',
};

// Generate home page data from existing dummy data arrays
async function generateHomeData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const trendingMusic: TrendingMusicItem[] = getTrendingMusicForHome(12);
  const trendingVideos: TrendingVideoItem[] = getTrendingVideosForHome(12);
  const chartData: ChartItem[] = getChartDataForHome(10);
  const risingArtists: RisingArtist[] = getRisingArtistsForHome(4);
  const newsArticles: NewsArticle[] = getNewsArticlesForHome(6);

  const marketplaceProducts: MarketplaceProduct[] = [
    {
      _id: '1',
      name: 'Wireless Studio Headphones',
      price: '$149.99',
      seller: 'AudioTech',
      image: '/images/album-1.jpg',
    },
    {
      _id: '2',
      name: 'Custom Artist Hoodie',
      price: '$59.99',
      seller: 'UrbanWear',
      image: '/images/album-2.jpg',
    },
    {
      _id: '3',
      name: 'Portable Speaker',
      price: '$89.99',
      seller: 'SoundGear',
      image: '/images/album-3.jpg',
    },
    {
      _id: '4',
      name: 'Vinyl Record Set',
      price: '$39.99',
      seller: 'RetroBeats',
      image: '/images/album-1.jpg',
    },
  ];

  const communityPosts: CommunityPost[] = [
    {
      user: 'Sarah M.',
      avatar: '/images/artist-2.jpg',
      content: "Just dropped my first track on OJ Multimedia! Can't wait for you all to hear it 🎵",
      likes: 234,
      comments: 45,
    },
    {
      user: 'Marcus J.',
      avatar: '/images/artist-1.jpg',
      content: "Studio session vibes today. New music coming soon! Who's excited?",
      likes: 567,
      comments: 89,
    },
    {
      user: 'Aria R.',
      avatar: '/images/artist-3.jpg',
      content: 'Thank you for 10K streams on my latest single! You guys are the best ❤️',
      likes: 892,
      comments: 156,
    },
  ];

  const pollOptions: PollOption[] = [
    { option: 'Afrobeats', votes: 45 },
    { option: 'Hip-Hop', votes: 30 },
    { option: 'Pop', votes: 15 },
    { option: 'R&B', votes: 10 },
  ];

  return {
    trendingMusic,
    trendingVideos,
    chartData,
    risingArtists,
    newsArticles,
    marketplaceProducts,
    communityPosts,
    pollOptions,
    pollTotalVotes: 2456,
  };
}

export default async function Home() {
  const homeData = await generateHomeData();

  return (
    <MainLayout>
      <HeroSection />
      <Suspense fallback={<HomePageSkeleton />}>
        <HomePageClient {...homeData} />
      </Suspense>
    </MainLayout>
  );
}
