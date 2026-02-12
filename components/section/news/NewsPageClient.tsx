'use client';

import { Newspaper } from 'lucide-react';
import { NewsCategories } from './NewsCategories';
import { FeaturedStories, type FeaturedStory } from './FeaturedStories';
import { NewsFeed, type NewsItem } from './NewsFeed';
import { TrendingSidebar, type TrendingStory } from './TrendingSidebar';
import { VideoNews, type VideoNewsItem } from './VideoNews';
import { SectionComp } from '@/components/general/SectionComp';
import { NewsletterCTA } from '../shared';

interface NewsPageClientProps {
  featuredStories: FeaturedStory[];
  newsItems: NewsItem[];
  trendingStories: TrendingStory[];
  videoNews: VideoNewsItem[];
}

export const NewsPageClient = ({
  featuredStories,
  newsItems,
  trendingStories,
  videoNews,
}: NewsPageClientProps) => {
  return (
    <>
      <NewsCategories />
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
