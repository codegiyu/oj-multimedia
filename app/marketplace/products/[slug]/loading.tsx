import { MainLayout } from '@/components/layout/MainLayout';
import { ProductDetailSkeleton } from '@/components/section/marketplace/ProductDetailSkeleton';

export default function ProductDetailLoading() {
  return (
    <MainLayout>
      <ProductDetailSkeleton />
    </MainLayout>
  );
}
