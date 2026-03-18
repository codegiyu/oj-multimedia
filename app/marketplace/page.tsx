import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MarketplacePageClient } from '@/components/section/marketplace/MarketplacePageClient';
import { MarketplacePageSkeleton } from '@/components/section/marketplace/MarketplacePageSkeleton';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import type {
  IMarketplaceCategoriesRes,
  IMarketplaceProductsListRes,
  IMarketplaceVendorsRes,
  IMarketplaceProduct,
  IMarketplaceCategory,
  IMarketplaceVendor,
} from '@/lib/constants/endpoints';

export const metadata: Metadata = {
  title: 'Marketplace - Shop Products & Services',
  description:
    'Shop from verified vendors - fashion, food, health & beauty, accessories, digital products, and more. Discover unique products and services.',
};

export const dynamic = 'force-dynamic';

const DEFAULT_PAGE_SIZE = 8;

async function fetchMarketplaceLandingData(): Promise<{
  categories: IMarketplaceCategory[];
  featuredProducts: IMarketplaceProduct[];
  hotOrRecentProducts: IMarketplaceProduct[];
  vendors: IMarketplaceVendor[];
  error: string | null;
}> {
  try {
    const [categoriesRes, featuredRes, hotRes, vendorsRes] = await Promise.all([
      callServerApi('MARKETPLACE_GET_CATEGORIES', {}),
      callServerApi('MARKETPLACE_GET_PRODUCTS', {
        query: `?featured=1&limit=${DEFAULT_PAGE_SIZE}&status=published` as `?${string}`,
      }),
      callServerApi('MARKETPLACE_GET_PRODUCTS', {
        query: `?sort=recent&limit=${DEFAULT_PAGE_SIZE}&status=published` as `?${string}`,
      }),
      callServerApi('MARKETPLACE_GET_VENDORS', {
        query: `?limit=6` as `?${string}`,
      }),
    ]);

    const error =
      (categoriesRes.error as ApiErrorResponse)?.message ??
      (featuredRes.error as ApiErrorResponse)?.message ??
      (hotRes.error as ApiErrorResponse)?.message ??
      (vendorsRes.error as ApiErrorResponse)?.message ??
      null;

    const categories =
      (categoriesRes.data as IMarketplaceCategoriesRes | undefined)?.categories ?? [];
    const featuredProducts =
      (featuredRes.data as IMarketplaceProductsListRes | undefined)?.products ?? [];
    const hotOrRecentProducts =
      (hotRes.data as IMarketplaceProductsListRes | undefined)?.products ?? [];
    const vendors = (vendorsRes.data as IMarketplaceVendorsRes | undefined)?.vendors ?? [];

    return {
      categories,
      featuredProducts,
      hotOrRecentProducts,
      vendors,
      error: error ?? null,
    };
  } catch {
    return {
      categories: [],
      featuredProducts: [],
      hotOrRecentProducts: [],
      vendors: [],
      error: 'Failed to load marketplace data.',
    };
  }
}

export default async function MarketplacePage() {
  const data = await fetchMarketplaceLandingData();

  return (
    <MainLayout>
      <Suspense fallback={<MarketplacePageSkeleton />}>
        <MarketplacePageClient {...data} />
      </Suspense>
    </MainLayout>
  );
}
