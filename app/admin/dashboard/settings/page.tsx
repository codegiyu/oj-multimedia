import { SettingsPageClient } from '@/components/section/admin/settings/SettingsPageClient';
import { serverFetchSiteSettingsAll } from '@/lib/services/adminDashboardServerData';
import { Metadata } from 'next';
import { AdminSettingsPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage site settings and configuration',
};

export default function SettingsPage() {
  return (
    <Suspense fallback={<AdminSettingsPageSkeleton />}>
      <AdminSettingsPageServer />
    </Suspense>
  );
}

async function AdminSettingsPageServer() {
  const { settings, loadError } = await serverFetchSiteSettingsAll();
  return <SettingsPageClient initialSettings={settings} initialLoadError={loadError} />;
}
