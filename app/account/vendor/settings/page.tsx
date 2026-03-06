import { MainLayout } from '@/components/layout/MainLayout';
import { VendorSettingsPageClient } from '@/components/section/account/vendor/VendorSettingsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vendor Settings',
  description: 'Update your vendor store settings.',
};

export default function VendorSettingsPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <VendorSettingsPageClient />
    </MainLayout>
  );
}
