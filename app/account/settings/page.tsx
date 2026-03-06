import { MainLayout } from '@/components/layout/MainLayout';
import { AccountSettingsPageClient } from '@/components/section/account/AccountSettingsPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Update your account settings and preferences.',
};

export default function AccountSettingsPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <AccountSettingsPageClient />
    </MainLayout>
  );
}
