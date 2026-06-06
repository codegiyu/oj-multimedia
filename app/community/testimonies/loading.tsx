import { MainLayout } from '@/components/layout/MainLayout';
import { TestimoniesHero } from '@/components/section/community/testimonies/TestimoniesHero';
import { ShareTestimony } from '@/components/section/community/testimonies/ShareTestimony';
import {
  FeaturedTestimoniesSectionSkeleton,
  AllTestimoniesSectionSkeleton,
} from './_sections/skeletons';

export default function TestimoniesLoading() {
  return (
    <MainLayout>
      <TestimoniesHero />
      <FeaturedTestimoniesSectionSkeleton />
      <AllTestimoniesSectionSkeleton />
      <ShareTestimony />
    </MainLayout>
  );
}
