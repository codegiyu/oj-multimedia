import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/section/community/promote/HeroSection';
import { PromoteYourSongSection } from './_sections/PromoteYourSongSection';
import { GetFeaturedSection } from './_sections/GetFeaturedSection';
import { ContactSponsorshipSection } from './_sections/ContactSponsorshipSection';
import {
  PromoteYourSongSectionSkeleton,
  GetFeaturedSectionSkeleton,
  ContactSponsorshipSectionSkeleton,
} from './_sections/skeletons';

export const metadata: Metadata = {
  title: 'Promote Your Content - Reach Your Audience',
  description:
    'Promote your songs and ministry, get featured, and explore sponsorship opportunities. Content publishing is curated by our team—contact us to submit material for review.',
};

export default function PromoteYourContentPage() {
  return (
    <MainLayout>
      <HeroSection />
      <div className="container mx-auto px-4 pb-16">
        <Suspense fallback={<PromoteYourSongSectionSkeleton />}>
          <PromoteYourSongSection />
        </Suspense>
        <Suspense fallback={<GetFeaturedSectionSkeleton />}>
          <GetFeaturedSection />
        </Suspense>
        <Suspense fallback={<ContactSponsorshipSectionSkeleton />}>
          <ContactSponsorshipSection />
        </Suspense>
      </div>
    </MainLayout>
  );
}
