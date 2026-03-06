import { MainLayout } from '@/components/layout/MainLayout';
import { AccountOrdersPageClient } from '@/components/section/account/AccountOrdersPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orders',
  description: 'View and manage your orders.',
};

export default function AccountOrdersPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <AccountOrdersPageClient />
    </MainLayout>
  );
}
