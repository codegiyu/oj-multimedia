import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MarketplacePageClient } from '@/components/section/marketplace/MarketplacePageClient';
import { MarketplacePageSkeleton } from '@/components/section/marketplace/MarketplacePageSkeleton';
import { callPublicServerApi } from '@/lib/services/serverApi';
import type {
  IMarketplaceProduct,
  IMarketplaceCategory,
  IMarketplaceVendor,
} from '@/lib/constants/endpoints';

export const metadata: Metadata = {
  title: 'Marketplace - Shop Products & Services',
  description:
    'Shop from verified vendors - fashion, food, health & beauty, accessories, digital products, and more. Discover unique products and services.',
};

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
      callPublicServerApi('MARKETPLACE_GET_CATEGORIES', {}),
      callPublicServerApi('MARKETPLACE_GET_PRODUCTS', {
        query: `?featured=true&limit=${DEFAULT_PAGE_SIZE}&status=published` as `?${string}`,
      }),
      callPublicServerApi('MARKETPLACE_GET_PRODUCTS', {
        query: `?sort=recent&limit=${DEFAULT_PAGE_SIZE}&status=published` as `?${string}`,
      }),
      callPublicServerApi('MARKETPLACE_GET_VENDORS', {
        query: `?limit=6` as `?${string}`,
      }),
    ]);

    const error =
      (categoriesRes.type === 'error' ? categoriesRes.error?.message : null) ??
      (featuredRes.type === 'error' ? featuredRes.error?.message : null) ??
      (hotRes.type === 'error' ? hotRes.error?.message : null) ??
      (vendorsRes.type === 'error' ? vendorsRes.error?.message : null) ??
      null;

    const categories =
      categoriesRes.type === 'success' ? (categoriesRes.data?.categories ?? []) : [];
    const featuredProducts =
      featuredRes.type === 'success' ? (featuredRes.data?.products ?? []) : [];
    const hotOrRecentProducts = hotRes.type === 'success' ? (hotRes.data?.products ?? []) : [];
    const vendors = vendorsRes.type === 'success' ? (vendorsRes.data?.vendors ?? []) : [];

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
