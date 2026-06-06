import { MainLayout } from '@/components/layout/MainLayout';
import { MarketplaceVendorsPageSkeleton } from '@/components/section/marketplace/MarketplaceVendorsPageSkeleton';

export default function MarketplaceVendorsLoading() {
  return (
    <MainLayout>
      <MarketplaceVendorsPageSkeleton />
    </MainLayout>
  );
}
