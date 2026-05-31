import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ResourcesHero } from '@/components/section/community/resources/ResourcesHero';
import { ResourceDownloadCategoriesSection } from './_sections/ResourceDownloadCategoriesSection';
import { EbooksSection } from './_sections/EbooksSection';
import { BeatsSection } from './_sections/BeatsSection';
import { WallpapersSection } from './_sections/WallpapersSection';
import { AffiliateProductsSection } from './_sections/AffiliateProductsSection';
import {
  ResourceDownloadCategoriesSectionSkeleton,
  ResourceTypeSectionSkeleton,
} from './_sections/skeletons';

/** Next.js requires a literal — keep in sync with `ISR_REVALIDATE.slow` (3600s). */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Resources - Free Downloads & More',
  description:
    'Download free e-books, sermon templates, beats, wallpapers, and explore affiliate products. Access resources to support your faith journey.',
};

export default function ResourcesPage() {
  return (
    <MainLayout>
      <ResourcesHero />
      <Suspense fallback={<ResourceDownloadCategoriesSectionSkeleton />}>
        <ResourceDownloadCategoriesSection />
      </Suspense>
      <Suspense fallback={<ResourceTypeSectionSkeleton />}>
        <EbooksSection />
      </Suspense>
      <Suspense fallback={<ResourceTypeSectionSkeleton />}>
        <BeatsSection />
      </Suspense>
      <Suspense fallback={<ResourceTypeSectionSkeleton />}>
        <WallpapersSection />
      </Suspense>
      <Suspense fallback={<ResourceTypeSectionSkeleton />}>
        <AffiliateProductsSection />
      </Suspense>
    </MainLayout>
  );
}
