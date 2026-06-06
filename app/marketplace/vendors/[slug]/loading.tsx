import { MainLayout } from '@/components/layout/MainLayout';
import { VendorProfileSectionSkeleton, VendorProductsSectionSkeleton } from './_sections/skeletons';

export default function VendorStoreLoading() {
  return (
    <MainLayout>
      <VendorProfileSectionSkeleton />
      <VendorProductsSectionSkeleton />
    </MainLayout>
  );
}
