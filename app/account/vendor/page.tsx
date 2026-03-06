import { MainLayout } from '@/components/layout/MainLayout';
import { VendorPageClient } from '@/components/section/account/vendor/VendorPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vendor Dashboard',
  description: 'Manage your vendor account and store.',
};

export default function VendorPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <VendorPageClient />
    </MainLayout>
  );
}
