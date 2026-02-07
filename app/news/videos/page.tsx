import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';
import { VideoNewsPageClient } from '@/components/section/news';
import { filterByCategory } from '@/components/section/news/categoryUtils';
import { NewsPageSkeleton } from '@/components/section/news/NewsPageSkeleton';
import type { VideoNewsItem } from '@/components/section/news/VideoNews';
import { NEWS_ITEMS } from '@/lib/constants/news';

export const metadata: Metadata = {
  title: 'Video Stories - News & Lifestyle Updates',
  description:
    'Watch video stories covering behind-the-scenes content, inspiration, lifestyle, documentaries, and more.',
};

// Force dynamic rendering to ensure searchParams changes trigger re-renders
export const dynamic = 'force-dynamic';

// Generate video news data from central constants
async function generateVideoNewsData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Filter items with videoUrl and duration (video stories)
  const videoNews: VideoNewsItem[] = NEWS_ITEMS.filter(item => item.videoUrl && item.duration).map(
    item => ({
      _id: item._id,
      title: item.title,
      category: item.category,
      duration: item.duration!,
      image: item.image,
      views: item.views,
      author: item.author,
      date: item.date,
    })
  );

  return {
    videoNews,
  };
}

interface VideoNewsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function VideoNewsPage({ searchParams }: VideoNewsPageProps) {
  const params = await searchParams;
  const category = params.category || 'all';
  const data = await generateVideoNewsData();

  // Filter data server-side based on category
  const filteredData = {
    videoNews: filterByCategory(data.videoNews, category),
  };

  return (
    <MainLayout>
      <SubPageHero
        title="Video Stories"
        titleHighlight="Video"
        description="Watch engaging video stories covering behind-the-scenes content, inspiration, lifestyle, documentaries, and more. Visual stories that bring content to life."
        badgeText="Watch & Learn"
        badgeIcon="Play"
        backUrl="/news"
        backLabel="Back to News"
        stats={[{ icon: 'Play', text: 'Video content' }, { text: 'Multiple categories' }]}
      />
      <Suspense fallback={<NewsPageSkeleton />}>
        <VideoNewsPageClient {...filteredData} />
      </Suspense>
    </MainLayout>
  );
}
