import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TestimoniesHero } from '@/components/section/community/testimonies/TestimoniesHero';
import { ShareTestimony } from '@/components/section/community/testimonies/ShareTestimony';
import { FeaturedTestimoniesSection } from './_sections/FeaturedTestimoniesSection';
import { AllTestimoniesSection } from './_sections/AllTestimoniesSection';
import {
  FeaturedTestimoniesSectionSkeleton,
  AllTestimoniesSectionSkeleton,
} from './_sections/skeletons';

export const metadata: Metadata = {
  title: 'Testimonies - Stories of Faith & Transformation',
  description:
    "Read powerful testimonies from our community. Stories of healing, breakthrough, transformation, and God's faithfulness in the lives of believers.",
};

interface TestimoniesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function TestimoniesPage({ searchParams }: TestimoniesPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(String(pageParam ?? '1'), 10) || 1);

  return (
    <MainLayout>
      <TestimoniesHero />
      <Suspense fallback={<FeaturedTestimoniesSectionSkeleton />}>
        <FeaturedTestimoniesSection />
      </Suspense>
      <Suspense fallback={<AllTestimoniesSectionSkeleton />} key={page}>
        <AllTestimoniesSection page={page} />
      </Suspense>
      <ShareTestimony />
    </MainLayout>
  );
}
