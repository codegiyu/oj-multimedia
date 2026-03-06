import { MainLayout } from '@/components/layout/MainLayout';
import { VendorOrdersPageClient } from '@/components/section/account/vendor/VendorOrdersPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vendor Orders',
  description: 'View and manage your vendor orders.',
};

export default function VendorOrdersPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <VendorOrdersPageClient />
    </MainLayout>
  );
}
