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

export const metadata = {
  title: 'Home - Discover Music, Charts & Latest Content',
  description:
    'Explore our dynamic homepage featuring music categories, top charts, recent uploads, download metrics, trending content, and discover new music and audio content. Stay engaged with our lively, ever-updating platform.',
};

// Generate home page data (in a real app, this would come from an API or database)
async function generateHomeData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  const trendingMusic: TrendingMusicItem[] = [
    {
      title: 'Sunset Vibes',
      artist: 'DJ Flame',
      cover: '/images/album-1.jpg',
      plays: '2.4M',
      genre: 'Afrobeats',
      isNew: true,
    },
    {
      title: 'City Lights',
      artist: 'Luna Belle',
      cover: '/images/album-2.jpg',
      plays: '1.8M',
      genre: 'Pop',
      isNew: false,
    },
    {
      title: 'Midnight Dreams',
      artist: 'The Wave',
      cover: '/images/album-3.jpg',
      plays: '1.2M',
      genre: 'R&B',
      isNew: true,
    },
    {
      title: 'Electric Soul',
      artist: 'Marcus Jay',
      cover: '/images/artist-1.jpg',
      plays: '980K',
      genre: 'Hip-Hop',
      isNew: false,
    },
    {
      title: 'Golden Hour',
      artist: 'Aria Rose',
      cover: '/images/artist-2.jpg',
      plays: '756K',
      genre: 'Soul',
      isNew: false,
    },
    {
      title: 'Street Dreams',
      artist: 'King Vibe',
      cover: '/images/artist-3.jpg',
      plays: '654K',
      genre: 'Rap',
      isNew: true,
    },
  ];

  const trendingVideos: TrendingVideoItem[] = [
    {
      title: 'Live Performance at The Arena - Full Concert Highlights',
      creator: 'DJ Flame',
      thumbnail: '/images/video-thumb-1.jpg',
      views: '1.2M views',
      duration: '12:34',
      category: 'Music Video',
    },
    {
      title: 'Dance Choreography - Urban Moves Tutorial',
      creator: 'Dance Crew Official',
      thumbnail: '/images/video-thumb-2.jpg',
      views: '856K views',
      duration: '8:45',
      category: 'Dance',
    },
    {
      title: 'Sunset Sessions - Acoustic Live Performance',
      creator: 'Marcus Jay',
      thumbnail: '/images/video-thumb-3.jpg',
      views: '623K views',
      duration: '15:20',
      category: 'Live Session',
    },
    {
      title: 'Behind The Scenes - New Album Recording',
      creator: 'Luna Belle',
      thumbnail: '/images/artist-1.jpg',
      views: '445K views',
      duration: '6:12',
      category: 'BTS',
    },
    {
      title: 'Street Performance - Raw Talent Showcase',
      creator: 'Aria Rose',
      thumbnail: '/images/artist-2.jpg',
      views: '312K views',
      duration: '4:55',
      category: 'Short Clip',
    },
  ];

  const chartData: ChartItem[] = [
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
  ];

  const risingArtists: RisingArtist[] = [
    {
      name: 'Luna Belle',
      genre: 'Pop',
      image: '/images/artist-2.jpg',
      followers: '45K',
    },
    {
      name: 'Marcus Jay',
      genre: 'Hip-Hop',
      image: '/images/artist-1.jpg',
      followers: '38K',
    },
    {
      name: 'Aria Rose',
      genre: 'R&B',
      image: '/images/album-2.jpg',
      followers: '32K',
    },
    {
      name: 'King Vibe',
      genre: 'Afrobeats',
      image: '/images/artist-3.jpg',
      followers: '28K',
    },
  ];

  const newsArticles: NewsArticle[] = [
    {
      title: 'Top 10 Rising Artists You Need to Know in 2025',
      excerpt:
        'Discover the fresh voices and innovative sounds that are reshaping the music landscape this year.',
      category: 'Entertainment',
      time: '2 hours ago',
      image: '/images/video-thumb-1.jpg',
      featured: true,
    },
    {
      title: 'The Evolution of Afrobeats: From Lagos to the World',
      excerpt: 'How a local genre became a global phenomenon influencing artists worldwide.',
      category: 'Music',
      time: '5 hours ago',
      image: '/images/video-thumb-2.jpg',
    },
    {
      title: 'Young Creators Making Waves in Digital Content',
      excerpt: 'Meet the Gen-Z content creators who are redefining entertainment online.',
      category: 'Lifestyle',
      time: '8 hours ago',
      image: '/images/video-thumb-3.jpg',
    },
  ];

  const marketplaceProducts: MarketplaceProduct[] = [
    {
      name: 'Wireless Studio Headphones',
      price: '$149.99',
      seller: 'AudioTech',
      image: '/images/album-1.jpg',
    },
    {
      name: 'Custom Artist Hoodie',
      price: '$59.99',
      seller: 'UrbanWear',
      image: '/images/album-2.jpg',
    },
    {
      name: 'Portable Speaker',
      price: '$89.99',
      seller: 'SoundGear',
      image: '/images/album-3.jpg',
    },
    {
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
