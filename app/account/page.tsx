import { MainLayout } from '@/components/layout/MainLayout';
import { AccountPageClient } from '@/components/section/account/AccountPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Manage your account and preferences.',
};

export default function AccountPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <AccountPageClient />
    </MainLayout>
  );
}
