import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MarketplaceSearchPageClient } from '@/components/section/marketplace/MarketplaceSearchPageClient';
import { MarketplaceProductsPageSkeleton } from '@/components/section/marketplace/MarketplaceProductsPageSkeleton';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import type {
  IMarketplaceCategory,
  IMarketplaceVendor,
  IMarketplaceProduct,
} from '@/lib/constants/endpoints';

export const metadata: Metadata = {
  title: 'Search - Marketplace',
  description: 'Search products and filter by category, vendor, and more.',
};

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
      callPublicServerApi('MARKETPLACE_GET_CATEGORIES', {}, ISR_PUBLIC_FETCH.fast),
      callPublicServerApi(
        'MARKETPLACE_GET_VENDORS',
        { query: `?limit=100` as `?${string}` },
        ISR_PUBLIC_FETCH.fast
      ),
      callPublicServerApi(
        'MARKETPLACE_GET_PRODUCTS',
        {
          query: `?${query.toString()}` as `?${string}`,
        },
        ISR_PUBLIC_FETCH.fast
      ),
    ]);

    const error = productsRes.type === 'error' ? (productsRes.error?.message ?? null) : null;
    const categories =
      categoriesRes.type === 'success' ? (categoriesRes.data?.categories ?? []) : [];
    const vendors = vendorsRes.type === 'success' ? (vendorsRes.data?.vendors ?? []) : [];
    const products = productsRes.type === 'success' ? (productsRes.data?.products ?? []) : [];
    const pagination = (productsRes.type === 'success' ? productsRes.data?.pagination : null) ?? {
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
