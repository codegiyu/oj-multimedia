import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityHero } from '@/components/section/community/CommunityHero';
import { CommunityCTA } from '@/components/section/shared';
import { CommunityCategoriesSection } from './_sections/CommunityCategoriesSection';
import { FeaturedTestimoniesHubSection } from './_sections/FeaturedTestimoniesHubSection';
import { TrendingDevotionalsHubSection } from './_sections/TrendingDevotionalsHubSection';
import { RecentPrayerRequestsHubSection } from './_sections/RecentPrayerRequestsHubSection';
import {
  CommunityCategoriesSkeleton,
  FeaturedTestimoniesHubSkeleton,
  TrendingDevotionalsHubSkeleton,
  RecentPrayerRequestsHubSkeleton,
} from './_sections/skeletons';

export const metadata: Metadata = {
  title: 'Community - Connect & Engage',
  description:
    'Join our vibrant community - share stories, connect with others, participate in discussions, polls, and engage with content creators.',
};

export default function CommunityPage() {
  return (
    <MainLayout>
      <CommunityHero />
      <Suspense fallback={<CommunityCategoriesSkeleton />}>
        <CommunityCategoriesSection />
      </Suspense>
      <Suspense fallback={<FeaturedTestimoniesHubSkeleton />}>
        <FeaturedTestimoniesHubSection />
      </Suspense>
      <Suspense fallback={<TrendingDevotionalsHubSkeleton />}>
        <TrendingDevotionalsHubSection />
      </Suspense>
      <Suspense fallback={<RecentPrayerRequestsHubSkeleton />}>
        <RecentPrayerRequestsHubSection />
      </Suspense>
      <CommunityCTA />
    </MainLayout>
  );
}
