import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Newspaper } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { NewsHero } from '@/components/section/news/NewsHero';
import { SectionComp } from '@/components/general/SectionComp';
import { NewsletterCTA } from '@/components/section/shared';
import { normalizePublicCategoryByScope } from '@/lib/utils/contentCategoriesServer';
import { NewsCategoriesSection } from './_sections/NewsCategoriesSection';
import { BreakingNewsSection } from './_sections/BreakingNewsSection';
import { FeaturedStoriesSection } from './_sections/FeaturedStoriesSection';
import { LatestFeedSection } from './_sections/LatestFeedSection';
import { TrendingSidebarSection } from './_sections/TrendingSidebarSection';
import { VideoNewsSection } from './_sections/VideoNewsSection';
import {
  NewsCategoriesSkeleton,
  BreakingNewsSectionSkeleton,
  FeaturedStoriesSectionSkeleton,
  LatestFeedSectionSkeleton,
  TrendingSidebarSectionSkeleton,
  VideoNewsSectionSkeleton,
} from './_sections/skeletons';

export const metadata: Metadata = {
  title: 'News & Lifestyle Updates',
  description:
    'Stay updated with the latest news, announcements, inspirational stories, lifestyle content, and trending topics. Explore recent updates and popular stories.',
};

interface NewsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const category = await normalizePublicCategoryByScope('news', params.category);

  return (
    <MainLayout>
      <NewsHero />
      <Suspense fallback={<NewsCategoriesSkeleton />}>
        <NewsCategoriesSection category={category} />
      </Suspense>
      <Suspense fallback={<BreakingNewsSectionSkeleton />}>
        <BreakingNewsSection category={category} />
      </Suspense>
      <Suspense fallback={<FeaturedStoriesSectionSkeleton />}>
        <FeaturedStoriesSection category={category} />
      </Suspense>
      <SectionComp
        icon={Newspaper}
        iconColor="primary"
        heading="Latest Stories"
        subtext="Stay updated with the latest news and stories"
        contentProps={{ enableAnimation: false }}>
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <Suspense fallback={<LatestFeedSectionSkeleton />}>
            <LatestFeedSection category={category} />
          </Suspense>
          <div className="hidden lg:block">
            <div className="sticky top-32">
              <Suspense fallback={<TrendingSidebarSectionSkeleton />}>
                <TrendingSidebarSection category={category} />
              </Suspense>
            </div>
          </div>
        </div>
      </SectionComp>
      <Suspense fallback={<VideoNewsSectionSkeleton />}>
        <VideoNewsSection category={category} />
      </Suspense>
      <NewsletterCTA />
    </MainLayout>
  );
}
