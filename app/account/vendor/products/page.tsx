import { MainLayout } from '@/components/layout/MainLayout';
import { VendorProductsPageClient } from '@/components/section/account/vendor/VendorProductsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vendor Products',
  description: 'Manage your vendor products.',
};

export default function VendorProductsPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <VendorProductsPageClient />
    </MainLayout>
  );
}
