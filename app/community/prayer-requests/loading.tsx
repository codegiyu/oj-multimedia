import { MainLayout } from '@/components/layout/MainLayout';
import { PrayerRequestsHero } from '@/components/section/community/prayer-requests/PrayerRequestsHero';
import { SubmitPrayerRequestSection } from '@/components/section/community/prayer-requests/SubmitPrayerRequestSection';
import { CommunityCTA } from '@/components/section/shared';
import {
  ActivePrayerRequestsSectionSkeleton,
  PrayerHubSupplementSectionSkeleton,
} from './_sections/skeletons';

export default function PrayerRequestsLoading() {
  return (
    <MainLayout>
      <PrayerRequestsHero />
      <ActivePrayerRequestsSectionSkeleton />
      <SubmitPrayerRequestSection />
      <PrayerHubSupplementSectionSkeleton />
      <CommunityCTA />
    </MainLayout>
  );
}
