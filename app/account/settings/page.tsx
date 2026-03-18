import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AccountSettingsPageClient } from '@/components/section/account/AccountSettingsPageClient';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Update your account settings and preferences.',
};

function AccountSettingsPageSkeleton() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-4">
      <div className="h-7 w-48 rounded-md bg-muted" />
      <div className="h-4 w-32 rounded-md bg-muted" />
      <div className="space-y-3 mt-4">
        <div className="h-20 w-full rounded-lg bg-muted" />
        <div className="h-20 w-full rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default function AccountSettingsPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <Suspense fallback={<AccountSettingsPageSkeleton />}>
        <AccountSettingsPageClientServer />
      </Suspense>
    </MainLayout>
  );
}

async function AccountSettingsPageClientServer() {
  const res = await callServerApi('USER_GET_ME', {});

  if (res.type === 'error') {
    const responseCode = res.error?.responseCode;
    return (
      <AccountSettingsPageClient
        initialUser={null}
        initialLoadError={
          responseCode === 401 ? null : res.message || "We couldn't load your profile."
        }
      />
    );
  }

  return <AccountSettingsPageClient initialUser={res.data.user} initialLoadError={null} />;
}
