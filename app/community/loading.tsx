import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityHero } from '@/components/section/community/CommunityHero';
import { CommunityCTA } from '@/components/section/shared';
import {
  CommunityCategoriesSkeleton,
  FeaturedTestimoniesHubSkeleton,
  TrendingDevotionalsHubSkeleton,
  RecentPrayerRequestsHubSkeleton,
} from './_sections/skeletons';

export default function CommunityLoading() {
  return (
    <MainLayout>
      <CommunityHero />
      <CommunityCategoriesSkeleton />
      <FeaturedTestimoniesHubSkeleton />
      <TrendingDevotionalsHubSkeleton />
      <RecentPrayerRequestsHubSkeleton />
      <CommunityCTA />
    </MainLayout>
  );
}
