import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MarketplaceProductsShell } from '@/components/section/marketplace/MarketplaceProductsShell';
import { callPublicServerApi } from '@/lib/services/serverApi';
import { ISR_PUBLIC_FETCH } from '@/lib/constants/isr';
import { ProductsCategoriesAsideSection } from './_sections/ProductsCategoriesAsideSection';
import { ProductsSubcategoriesSection } from './_sections/ProductsSubcategoriesSection';
import { ProductsGridSection } from './_sections/ProductsGridSection';
import {
  ProductsCategoriesAsideSkeleton,
  ProductsSubcategoriesSkeleton,
  ProductsGridSectionSkeleton,
} from './_sections/skeletons';
import type { MarketplaceProductsQueryParams } from '../_sections/shared';

export const metadata: Metadata = {
  title: 'Products - Marketplace',
  description: 'Browse all products from our marketplace vendors. Filter by category.',
};

interface PageProps {
  searchParams: Promise<MarketplaceProductsQueryParams>;
}

async function resolveCategoryLabel(category?: string) {
  if (!category) return undefined;
  const res = await callPublicServerApi('MARKETPLACE_GET_CATEGORIES', {}, ISR_PUBLIC_FETCH.fast);
  if (res.type !== 'success') return undefined;

  return res.data?.categories?.find(c => c.slug === category)?.name;
}

export default async function MarketplaceProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categoryLabel = await resolveCategoryLabel(params.category);
  const productsQueryKey = [
    params.category ?? '',
    params.subCategory ?? '',
    params.sort ?? '',
    params.page ?? '1',
    params.limit ?? '',
  ].join('|');

  return (
    <MainLayout>
      <MarketplaceProductsShell
        categoriesAside={
          <Suspense fallback={<ProductsCategoriesAsideSkeleton />}>
            <ProductsCategoriesAsideSection activeCategory={params.category} />
          </Suspense>
        }
        subcategoriesBar={
          params.category ? (
            <Suspense fallback={<ProductsSubcategoriesSkeleton />}>
              <ProductsSubcategoriesSection
                category={params.category}
                activeSubCategory={params.subCategory}
              />
            </Suspense>
          ) : undefined
        }
        productsMain={
          <Suspense fallback={<ProductsGridSectionSkeleton />} key={productsQueryKey}>
            <ProductsGridSection params={params} categoryLabel={categoryLabel} />
          </Suspense>
        }
      />
    </MainLayout>
  );
}
