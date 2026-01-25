import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoHero } from '@/components/section/video/VideoHero';
import { VideoPageClient } from '@/components/section/video/VideoPageClient';
import { VideoPageSkeleton } from '@/components/section/video/VideoPageSkeleton';
import type { TrendingVideo } from '@/components/section/video/TrendingVideos';
import type { FeaturedVideo } from '@/components/section/video/FeaturedVideos';
import type { RecentVideoUpload } from '@/components/section/video/RecentVideoUploads';
import type { ShortFormVideo } from '@/components/section/video/ShortFormVideos';
import type { FeaturedCreator } from '@/components/section/video/CreatorSpotlight';

export const metadata: Metadata = {
  title: 'Videos - Trending & Creative Content',
  description:
    'Discover trending videos, watch creative content, explore music videos, short clips, talks, and inspirational videos from talented creators. Upload and share your own videos.',
};

// Generate video data (in a real app, this would come from an API or database)
async function generateVideoData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  const trendingVideos: TrendingVideo[] = [
    {
      id: 1,
      title: 'Sunset Vibes - Official Music Video',
      creator: 'DJ Flame',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
      views: '2.4M',
      duration: '3:45',
      uploadedAt: '2 days ago',
      isNew: true,
    },
    {
      id: 2,
      title: 'City Lights - Live Performance',
      creator: 'Luna Belle',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      views: '1.8M',
      duration: '4:12',
      uploadedAt: '3 days ago',
      isNew: false,
    },
    {
      id: 3,
      title: 'Midnight Dreams - Creative Short',
      creator: 'The Wave',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
      views: '1.2M',
      duration: '2:28',
      uploadedAt: '4 days ago',
      isNew: true,
    },
    {
      id: 4,
      title: 'Electric Soul - Music Video',
      creator: 'Marcus Jay',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      views: '980K',
      duration: '3:55',
      uploadedAt: '5 days ago',
      isNew: false,
    },
    {
      id: 5,
      title: 'Golden Hour - Inspirational Talk',
      creator: 'Aria Rose',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
      views: '756K',
      duration: '8:08',
      uploadedAt: '6 days ago',
      isNew: false,
    },
    {
      id: 6,
      title: 'Street Dreams - Short Film',
      creator: 'King Vibe',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      views: '654K',
      duration: '5:32',
      uploadedAt: '1 week ago',
      isNew: true,
    },
    {
      id: 7,
      title: 'Ocean Waves - Creative Content',
      creator: 'Crystal',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
      views: '543K',
      duration: '3:18',
      uploadedAt: '1 week ago',
      isNew: false,
    },
    {
      id: 8,
      title: 'Neon Nights - Live Stream',
      creator: 'Summer',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      views: '432K',
      duration: '12:50',
      uploadedAt: '1 week ago',
      isNew: false,
    },
  ];

  const featuredVideos: FeaturedVideo[] = [
    {
      id: 1,
      title: 'The Art of Creative Expression',
      creator: 'Creative Minds',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
      views: '3.2M',
      duration: '15:30',
      category: 'Creative Content',
      featured: true,
    },
    {
      id: 2,
      title: 'Inspiring Stories: Journey to Success',
      creator: 'Motivation Hub',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      views: '2.8M',
      duration: '22:15',
      category: 'Inspirational',
      featured: true,
    },
    {
      id: 3,
      title: 'Live Concert: Summer Vibes',
      creator: 'Music Fest',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
      views: '1.9M',
      duration: '45:20',
      category: 'Live Performances',
      featured: true,
    },
    {
      id: 4,
      title: 'Deep Dive: Creative Process',
      creator: 'Art Studio',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop',
      views: '1.5M',
      duration: '18:45',
      category: 'Talks & Speeches',
      featured: false,
    },
  ];

  const recentUploads: RecentVideoUpload[] = [
    {
      id: 1,
      title: 'Morning Inspiration - Daily Motivation',
      creator: 'Sarah Grace',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=169&fit=crop',
      uploadedAt: '2 hours ago',
      category: 'Inspirational',
      views: '12K',
      duration: '5:30',
    },
    {
      id: 2,
      title: 'Urban Flow - Street Performance',
      creator: 'Metro Kid',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=169&fit=crop',
      uploadedAt: '4 hours ago',
      category: 'Live Performances',
      views: '8.5K',
      duration: '4:15',
    },
    {
      id: 3,
      title: 'Creative Process: Behind the Scenes',
      creator: 'Zen Beats',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=169&fit=crop',
      uploadedAt: '6 hours ago',
      category: 'Creative Content',
      views: '6.2K',
      duration: '8:20',
    },
    {
      id: 4,
      title: 'Rise Up - Motivational Talk',
      creator: 'Victory Sound',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=169&fit=crop',
      uploadedAt: '8 hours ago',
      category: 'Talks & Speeches',
      views: '5.8K',
      duration: '12:45',
    },
    {
      id: 5,
      title: 'Summer Feels - Music Video',
      creator: 'Beach Vibes',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=169&fit=crop',
      uploadedAt: '12 hours ago',
      category: 'Music Videos',
      views: '4.3K',
      duration: '3:50',
    },
    {
      id: 6,
      title: 'Heart & Soul - Creative Short',
      creator: 'Melody Grace',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=169&fit=crop',
      uploadedAt: '1 day ago',
      category: 'Short Clips',
      views: '3.9K',
      duration: '1:25',
    },
  ];

  const shortFormVideos: ShortFormVideo[] = [
    {
      id: 1,
      title: 'Quick Tips: Creative Hacks',
      creator: 'Quick Tips',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=300&fit=crop',
      views: '450K',
      duration: '0:45',
      likes: '12K',
    },
    {
      id: 2,
      title: '60 Second Motivation',
      creator: 'Motivate Daily',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
      views: '380K',
      duration: '1:00',
      likes: '9.5K',
    },
    {
      id: 3,
      title: 'Behind the Scenes',
      creator: 'Studio Life',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=300&fit=crop',
      views: '320K',
      duration: '0:30',
      likes: '8.2K',
    },
    {
      id: 4,
      title: 'Quick Dance Challenge',
      creator: 'Dance Crew',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
      views: '280K',
      duration: '0:45',
      likes: '7.8K',
    },
    {
      id: 5,
      title: 'Funny Moments Compilation',
      creator: 'Comedy Central',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=300&fit=crop',
      views: '250K',
      duration: '1:15',
      likes: '6.5K',
    },
    {
      id: 6,
      title: 'Quick Tutorial: Basics',
      creator: 'Learn Fast',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
      views: '220K',
      duration: '0:50',
      likes: '5.9K',
    },
    {
      id: 7,
      title: 'Trending Now: Top Clip',
      creator: 'Trending',
      thumbnail:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=300&fit=crop',
      views: '190K',
      duration: '0:40',
      likes: '5.2K',
    },
    {
      id: 8,
      title: 'Quick Inspiration',
      creator: 'Inspire Daily',
      thumbnail:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop',
      views: '165K',
      duration: '0:35',
      likes: '4.8K',
    },
  ];

  const featuredCreators: FeaturedCreator[] = [
    {
      id: 1,
      name: 'DJ Flame',
      category: 'Music Videos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      followers: '125K',
      videos: 45,
      views: '2.4M',
      verified: true,
      latestVideo: {
        thumbnail:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=112&fit=crop',
        title: 'Sunset Vibes - Official',
        duration: '3:45',
      },
    },
    {
      id: 2,
      name: 'Luna Belle',
      category: 'Creative Content',
      avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
      followers: '98K',
      videos: 32,
      views: '1.8M',
      verified: true,
      latestVideo: {
        thumbnail:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=112&fit=crop',
        title: 'City Lights - Live',
        duration: '4:12',
      },
    },
    {
      id: 3,
      name: 'Marcus Jay',
      category: 'Talks & Speeches',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      followers: '87K',
      videos: 28,
      views: '1.2M',
      verified: false,
      latestVideo: {
        thumbnail:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=112&fit=crop',
        title: 'Electric Soul',
        duration: '3:55',
      },
    },
    {
      id: 4,
      name: 'Aria Rose',
      category: 'Inspirational',
      avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
      followers: '76K',
      videos: 41,
      views: '980K',
      verified: true,
      latestVideo: {
        thumbnail:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=112&fit=crop',
        title: 'Golden Hour Talk',
        duration: '8:08',
      },
    },
    {
      id: 5,
      name: 'The Wave',
      category: 'Live Performances',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      followers: '64K',
      videos: 53,
      views: '756K',
      verified: false,
      latestVideo: {
        thumbnail:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=112&fit=crop',
        title: 'Midnight Dreams',
        duration: '2:28',
      },
    },
    {
      id: 6,
      name: 'King Vibe',
      category: 'Short Clips',
      avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
      followers: '58K',
      videos: 22,
      views: '654K',
      verified: true,
      latestVideo: {
        thumbnail:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=112&fit=crop',
        title: 'Street Dreams',
        duration: '5:32',
      },
    },
  ];

  return {
    trendingVideos,
    featuredVideos,
    recentUploads,
    shortFormVideos,
    featuredCreators,
  };
}

export default async function VideosPage() {
  const videoData = await generateVideoData();

  return (
    <MainLayout>
      <VideoHero />
      <Suspense fallback={<VideoPageSkeleton />}>
        <VideoPageClient {...videoData} />
      </Suspense>
    </MainLayout>
  );
}
