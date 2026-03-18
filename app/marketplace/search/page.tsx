import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MarketplaceSearchPageClient } from '@/components/section/marketplace/MarketplaceSearchPageClient';
import { MarketplaceProductsPageSkeleton } from '@/components/section/marketplace/MarketplaceProductsPageSkeleton';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import type {
  IMarketplaceCategoriesRes,
  IMarketplaceProductsListRes,
  IMarketplaceVendorsRes,
  IMarketplaceCategory,
  IMarketplaceVendor,
  IMarketplaceProduct,
} from '@/lib/constants/endpoints';

export const metadata: Metadata = {
  title: 'Search - Marketplace',
  description: 'Search products and filter by category, vendor, and more.',
};

export const dynamic = 'force-dynamic';

const DEFAULT_LIMIT = 24;

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    vendor?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }>;
}

async function fetchSearchData(
  params: PageProps['searchParams'] extends Promise<infer P> ? P : never
): Promise<{
  categories: IMarketplaceCategory[];
  vendors: IMarketplaceVendor[];
  products: IMarketplaceProduct[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  error: string | null;
}> {
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  const limit = Math.min(50, parseInt(params.limit ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT);
  const query = new URLSearchParams();
  query.set('page', String(page));
  query.set('limit', String(limit));
  query.set('status', 'published');
  if (params.q?.trim()) query.set('q', params.q.trim());
  if (params.category) query.set('category', params.category);
  if (params.vendor) query.set('vendor', params.vendor);
  if (params.sort) query.set('sort', params.sort);

  try {
    const [categoriesRes, vendorsRes, productsRes] = await Promise.all([
      callServerApi('MARKETPLACE_GET_CATEGORIES', {}),
      callServerApi('MARKETPLACE_GET_VENDORS', { query: `?limit=100` as `?${string}` }),
      callServerApi('MARKETPLACE_GET_PRODUCTS', {
        query: `?${query.toString()}` as `?${string}`,
      }),
    ]);

    const error = (productsRes.error as ApiErrorResponse)?.message ?? null;
    const categories =
      (categoriesRes.data as IMarketplaceCategoriesRes | undefined)?.categories ?? [];
    const vendors = (vendorsRes.data as IMarketplaceVendorsRes | undefined)?.vendors ?? [];
    const productsData = productsRes.data as IMarketplaceProductsListRes | undefined;
    const products = productsData?.products ?? [];
    const pagination = productsData?.pagination ?? {
      page: 1,
      limit: DEFAULT_LIMIT,
      total: 0,
      totalPages: 0,
    };

    return { categories, vendors, products, pagination, error: error ?? null };
  } catch {
    return {
      categories: [],
      vendors: [],
      products: [],
      pagination: { page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 0 },
      error: 'Failed to search.',
    };
  }
}

export default async function MarketplaceSearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await fetchSearchData(params);

  return (
    <MainLayout>
      <Suspense fallback={<MarketplaceProductsPageSkeleton />}>
        <MarketplaceSearchPageClient {...data} />
      </Suspense>
    </MainLayout>
  );
}
