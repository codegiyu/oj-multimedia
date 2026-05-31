import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MarketplaceSearchLayout } from '@/components/section/marketplace/MarketplaceSearchLayout';
import { SearchCategoryFilterSection } from './_sections/SearchCategoryFilterSection';
import { SearchVendorFilterSection } from './_sections/SearchVendorFilterSection';
import { SearchProductsResultsSection } from './_sections/SearchProductsResultsSection';
import { SearchFilterSkeleton, SearchProductsResultsSkeleton } from './_sections/skeletons';
import type { MarketplaceSearchQueryParams } from '../../_sections/shared';

export const metadata: Metadata = {
  title: 'Search - Marketplace',
  description: 'Search products and filter by category, vendor, and more.',
};

interface PageProps {
  searchParams: Promise<MarketplaceSearchQueryParams>;
}

export default async function MarketplaceSearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const productsQueryKey = [
    params.q ?? '',
    params.category ?? '',
    params.vendor ?? '',
    params.sort ?? '',
    params.page ?? '1',
    params.limit ?? '',
  ].join('|');

  return (
    <MainLayout>
      <MarketplaceSearchLayout
        categoryFilter={
          <Suspense fallback={<SearchFilterSkeleton />}>
            <SearchCategoryFilterSection />
          </Suspense>
        }
        vendorFilter={
          <Suspense fallback={<SearchFilterSkeleton />}>
            <SearchVendorFilterSection />
          </Suspense>
        }
        results={
          <Suspense fallback={<SearchProductsResultsSkeleton />} key={productsQueryKey}>
            <SearchProductsResultsSection params={params} />
          </Suspense>
        }
      />
    </MainLayout>
  );
}
