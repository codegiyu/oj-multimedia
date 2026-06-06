import { Newspaper } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { NewsHero } from '@/components/section/news/NewsHero';
import { SectionComp } from '@/components/general/SectionComp';
import { NewsletterCTA } from '@/components/section/shared';
import { newsSectionHeaderIcon } from './_sections/sectionIcons';
import {
  NewsHubDynamicSectionsSkeleton,
  NewsLatestStoriesContentSkeleton,
  VideoNewsSectionSkeleton,
} from './_sections/skeletons';

export default function NewsLoading() {
  return (
    <MainLayout>
      <NewsHero />
      <NewsHubDynamicSectionsSkeleton />
      <SectionComp
        iconSlot={newsSectionHeaderIcon(Newspaper)}
        heading="Latest Stories"
        subtext="Stay updated with the latest news and stories"
        contentProps={{ enableAnimation: false }}>
        <NewsLatestStoriesContentSkeleton />
      </SectionComp>
      <VideoNewsSectionSkeleton />
      <NewsletterCTA />
    </MainLayout>
  );
}
