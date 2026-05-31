import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MarketplaceLandingHero } from '@/components/section/marketplace/MarketplaceLandingHero';
import { MarketplaceQuickActions } from '@/components/section/marketplace/MarketplaceQuickActions';
import { MarketplaceCategoriesSection } from './_sections/MarketplaceCategoriesSection';
import { MarketplaceFeaturedProductsSection } from './_sections/MarketplaceFeaturedProductsSection';
import { MarketplaceRecentProductsSection } from './_sections/MarketplaceRecentProductsSection';
import { MarketplaceVendorsStripSection } from './_sections/MarketplaceVendorsStripSection';
import {
  MarketplaceCategoriesSectionSkeleton,
  MarketplaceFeaturedProductsSectionSkeleton,
  MarketplaceRecentProductsSectionSkeleton,
  MarketplaceVendorsStripSectionSkeleton,
} from './_sections/skeletons';

export const metadata: Metadata = {
  title: 'Marketplace - Shop Products & Services',
  description:
    'Shop from verified vendors - fashion, food, health & beauty, accessories, digital products, and more. Discover unique products and services.',
};

export default function MarketplacePage() {
  return (
    <MainLayout>
      <MarketplaceLandingHero />
      <Suspense fallback={<MarketplaceCategoriesSectionSkeleton />}>
        <MarketplaceCategoriesSection />
      </Suspense>
      <Suspense fallback={<MarketplaceFeaturedProductsSectionSkeleton />}>
        <MarketplaceFeaturedProductsSection />
      </Suspense>
      <Suspense fallback={<MarketplaceRecentProductsSectionSkeleton />}>
        <MarketplaceRecentProductsSection />
      </Suspense>
      <Suspense fallback={<MarketplaceVendorsStripSectionSkeleton />}>
        <MarketplaceVendorsStripSection />
      </Suspense>
      <MarketplaceQuickActions />
    </MainLayout>
  );
}
