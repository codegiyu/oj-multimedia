'use client';

import { useRouter } from 'next/navigation';
import { Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '@/components/general/SectionContainer';
import { DataLoadError } from '@/components/general/DataLoadError';
import { NewsCategories } from './NewsCategories';
import type { CategoryNavItem } from '@/lib/utils/contentCategoryNav';
import { FeaturedStories, type FeaturedStory } from './FeaturedStories';
import { NewsFeed, type NewsItem } from './NewsFeed';
import { TrendingSidebar, type TrendingStory } from './TrendingSidebar';
import { VideoNews, type VideoNewsItem } from './VideoNews';
import { BreakingNews, type BreakingNewsStory } from './BreakingNews';
import { SectionComp } from '@/components/general/SectionComp';
import { NewsletterCTA } from '../shared';

interface NewsPageClientProps {
  categoryOptions: CategoryNavItem[];
  featuredStories: FeaturedStory[];
  newsItems: NewsItem[];
  trendingStories: TrendingStory[];
  videoNews: VideoNewsItem[];
  breakingStories: BreakingNewsStory[];
  initialErrorMessage?: string | null;
}

export const NewsPageClient = ({
  categoryOptions,

  featuredStories,
  newsItems,
  trendingStories,
  videoNews,
  breakingStories,
  initialErrorMessage = null,
}: NewsPageClientProps) => {
  const router = useRouter();
  const hasAnyContent =
    featuredStories.length > 0 ||
    newsItems.length > 0 ||
    trendingStories.length > 0 ||
    videoNews.length > 0 ||
    breakingStories.length > 0;

  if (initialErrorMessage && !hasAnyContent) {
    return (
      <SectionContainer>
        <DataLoadError
          title="Unable to load news"
          message={initialErrorMessage}
          onRetry={() => router.refresh()}
          icon={<Newspaper className="w-8 h-8 text-destructive" />}
        />
      </SectionContainer>
    );
  }

  return (
    <>
      <NewsCategories categoryOptions={categoryOptions} />
      <BreakingNews stories={breakingStories} />
      {initialErrorMessage && (
        <div className="container mx-auto px-4 mb-4">
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
            <span>{initialErrorMessage}</span>
            <Button variant="outline" size="sm" onClick={() => router.refresh()}>
              Retry
            </Button>
          </div>
        </div>
      )}
      <FeaturedStories stories={featuredStories} />

      <SectionComp
        icon={Newspaper}
        iconColor="primary"
        heading="Latest Stories"
        subtext="Stay updated with the latest news and stories"
        contentProps={{ enableAnimation: false }}>
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <NewsFeed items={newsItems} />
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <TrendingSidebar stories={trendingStories} />
            </div>
          </div>
        </div>
      </SectionComp>

      <VideoNews videos={videoNews} />
      <NewsletterCTA />
    </>
  );
};
