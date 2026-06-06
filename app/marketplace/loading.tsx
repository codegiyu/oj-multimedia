import { MainLayout } from '@/components/layout/MainLayout';
import { MarketplaceLandingHero } from '@/components/section/marketplace/MarketplaceLandingHero';
import { MarketplaceQuickActions } from '@/components/section/marketplace/MarketplaceQuickActions';
import {
  MarketplaceCategoriesSectionSkeleton,
  MarketplaceFeaturedProductsSectionSkeleton,
  MarketplaceRecentProductsSectionSkeleton,
  MarketplaceVendorsStripSectionSkeleton,
} from './_sections/skeletons';

export default function MarketplaceLoading() {
  return (
    <MainLayout>
      <MarketplaceLandingHero />
      <MarketplaceCategoriesSectionSkeleton />
      <MarketplaceFeaturedProductsSectionSkeleton />
      <MarketplaceRecentProductsSectionSkeleton />
      <MarketplaceVendorsStripSectionSkeleton />
      <MarketplaceQuickActions />
    </MainLayout>
  );
}
