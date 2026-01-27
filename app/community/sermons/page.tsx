import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SermonsHero } from '@/components/section/community/sermons/SermonsHero';
import {
  SermonsPageClient,
  type AudioSermon,
  type VideoSermon,
  type PopularSermon,
} from '@/components/section/community/sermons/SermonsPageClient';
import { SermonsPageSkeleton } from '@/components/section/community/sermons/SermonsPageSkeleton';
import { SERMONS_ITEMS } from '@/lib/constants/community/sermons';
import { PASTORS } from '@/lib/constants/community/sermons';
import { SERMON_TOPICS } from '@/lib/constants/community/sermons';

export const metadata: Metadata = {
  title: 'Sermons - Audio & Video Messages',
  description:
    'Listen to audio sermons, watch video messages, explore sermons by topic, discover featured pastors, and upload your own monetizable sermon content.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate sermons data from central constants
async function generateSermonsData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Filter and transform audio sermons (limit to 4)
  const audioSermons: AudioSermon[] = SERMONS_ITEMS.filter(
    item => item.isAudio && item.plays !== undefined && item.image !== undefined
  )
    .slice(0, 4)
    .map(item => ({
      id: item.id,
      title: item.title,
      pastor: item.pastor,
      duration: item.duration,
      plays: item.plays!,
      date: item.date || '',
      image: item.image!,
    }));

  // Filter and transform video sermons (limit to 4)
  const videoSermons: VideoSermon[] = SERMONS_ITEMS.filter(
    item => item.isVideo && item.views !== undefined && item.thumbnail !== undefined
  )
    .slice(0, 4)
    .map(item => ({
      id: item.id,
      title: item.title,
      pastor: item.pastor,
      duration: item.duration,
      views: item.views!,
      thumbnail: item.thumbnail!,
      isLive: item.isLive || false,
      isNew: item.isNew || false,
    }));

  // Transform sermon topics
  const topics = SERMON_TOPICS.map(topic => ({
    id: topic.id,
    name: topic.name,
    count: topic.count,
    description: topic.description,
  }));

  // Transform pastors
  const pastors = PASTORS.map(pastor => ({
    id: pastor.id,
    name: pastor.name,
    title: pastor.title,
    church: pastor.church,
    image: pastor.image,
    sermons: pastor.sermons,
    followers: pastor.followers,
    featured: pastor.featured,
    topics: pastor.topics,
  }));

  // Filter and transform popular sermons (limit to 4)
  const popularSermons: PopularSermon[] = SERMONS_ITEMS.filter(
    item => item.isPopular && item.views !== undefined && item.thumbnail !== undefined
  )
    .slice(0, 4)
    .map(item => ({
      id: item.id,
      title: item.title,
      pastor: item.pastor,
      duration: item.duration,
      views: item.views!,
      thumbnail: item.thumbnail!,
      category: item.category || item.topic || '',
      trending: item.isTrending || false,
    }));

  return {
    audioSermons,
    videoSermons,
    topics,
    pastors,
    popularSermons,
  };
}

export default async function CommunitySermonsPage() {
  const sermonsData = await generateSermonsData();

  return (
    <MainLayout>
      <SermonsHero />
      <Suspense fallback={<SermonsPageSkeleton />}>
        <SermonsPageClient {...sermonsData} />
      </Suspense>
    </MainLayout>
  );
}
