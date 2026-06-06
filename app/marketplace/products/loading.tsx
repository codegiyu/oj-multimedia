import { MainLayout } from '@/components/layout/MainLayout';
import { MarketplaceProductsShell } from '@/components/section/marketplace/MarketplaceProductsShell';
import {
  ProductsCategoriesAsideSkeleton,
  ProductsGridSectionSkeleton,
} from './_sections/skeletons';

export default function MarketplaceProductsLoading() {
  return (
    <MainLayout>
      <MarketplaceProductsShell
        categoriesAside={<ProductsCategoriesAsideSkeleton />}
        productsMain={<ProductsGridSectionSkeleton />}
      />
    </MainLayout>
  );
}
