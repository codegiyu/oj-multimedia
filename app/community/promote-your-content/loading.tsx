import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/section/community/promote/HeroSection';
import {
  ContactSponsorshipSectionSkeleton,
  GetFeaturedSectionSkeleton,
  PromoteYourSongSectionSkeleton,
} from './_sections/skeletons';

export default function PromoteYourContentLoading() {
  return (
    <MainLayout>
      <HeroSection />
      <div className="container mx-auto px-4 pb-16">
        <PromoteYourSongSectionSkeleton />
        <GetFeaturedSectionSkeleton />
        <ContactSponsorshipSectionSkeleton />
      </div>
    </MainLayout>
  );
}
