import { MainLayout } from '@/components/layout/MainLayout';
import { MarketplaceSearchLayout } from '@/components/section/marketplace/MarketplaceSearchLayout';
import { SearchFilterSkeleton, SearchProductsResultsSkeleton } from './_sections/skeletons';

export default function MarketplaceSearchLoading() {
  return (
    <MainLayout>
      <MarketplaceSearchLayout
        categoryFilter={<SearchFilterSkeleton />}
        vendorFilter={<SearchFilterSkeleton />}
        results={<SearchProductsResultsSkeleton />}
      />
    </MainLayout>
  );
}
