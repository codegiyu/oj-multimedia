import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MarketplaceProductsPageClient } from '@/components/section/marketplace/MarketplaceProductsPageClient';
import { MarketplaceProductsPageSkeleton } from '@/components/section/marketplace/MarketplaceProductsPageSkeleton';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import type {
  IMarketplaceCategoriesRes,
  IMarketplaceSubCategoriesRes,
  IMarketplaceProductsListRes,
  IMarketplaceCategory,
  IMarketplaceSubCategory,
  IMarketplaceProduct,
} from '@/lib/constants/endpoints';

export const metadata: Metadata = {
  title: 'Products - Marketplace',
  description: 'Browse all products from our marketplace vendors. Filter by category.',
};

export const dynamic = 'force-dynamic';

const DEFAULT_LIMIT = 24;

interface PageProps {
  searchParams: Promise<{
    category?: string;
    subCategory?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }>;
}

async function fetchProductsPageData(params: {
  category?: string;
  subCategory?: string;
  sort?: string;
  page?: string;
  limit?: string;
}): Promise<{
  categories: IMarketplaceCategory[];
  subcategories: IMarketplaceSubCategory[];
  products: IMarketplaceProduct[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  error: string | null;
}> {
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  const limit = Math.min(
    50,
    Math.max(1, parseInt(params.limit ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
  );
  const query = new URLSearchParams();
  query.set('page', String(page));
  query.set('limit', String(limit));
  if (params.category) query.set('category', params.category);
  if (params.subCategory) query.set('subCategory', params.subCategory);
  if (params.sort) query.set('sort', params.sort);
  query.set('status', 'published');

  try {
    const [categoriesRes, subcategoriesRes, productsRes] = await Promise.all([
      callServerApi('MARKETPLACE_GET_CATEGORIES', {}),
      params.category
        ? callServerApi('MARKETPLACE_GET_SUBCATEGORIES', {
            query: `?category=${encodeURIComponent(params.category)}` as `?${string}`,
          })
        : Promise.resolve({
            data: { subcategories: [] as IMarketplaceSubCategory[] },
            error: null,
          }),
      callServerApi('MARKETPLACE_GET_PRODUCTS', {
        query: `?${query.toString()}` as `?${string}`,
      }),
    ]);

    const error =
      (categoriesRes.error as ApiErrorResponse)?.message ??
      (productsRes.error as ApiErrorResponse)?.message ??
      null;

    const categories =
      (categoriesRes.data as IMarketplaceCategoriesRes | undefined)?.categories ?? [];
    const subcategories =
      (subcategoriesRes.data as IMarketplaceSubCategoriesRes | undefined)?.subcategories ?? [];
    const productsData = productsRes.data as IMarketplaceProductsListRes | undefined;
    const products = productsData?.products ?? [];
    const pagination = productsData?.pagination ?? {
      page: 1,
      limit: DEFAULT_LIMIT,
      total: 0,
      totalPages: 0,
    };

    return {
      categories,
      subcategories,
      products,
      pagination,
      error: error ?? null,
    };
  } catch {
    return {
      categories: [],
      subcategories: [],
      products: [],
      pagination: { page: 1, limit: DEFAULT_LIMIT, total: 0, totalPages: 0 },
      error: 'Failed to load products.',
    };
  }
}

export default async function MarketplaceProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await fetchProductsPageData(params);

  return (
    <MainLayout>
      <Suspense fallback={<MarketplaceProductsPageSkeleton />}>
        <MarketplaceProductsPageClient {...data} />
      </Suspense>
    </MainLayout>
  );
}
