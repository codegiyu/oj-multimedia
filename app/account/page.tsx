import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AccountPageClient } from '@/components/section/account/AccountPageClient';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Manage your account and preferences.',
};

function AccountPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-4">
      <div className="h-8 w-32 rounded-md bg-muted" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="h-24 rounded-lg bg-muted" />
        <div className="h-24 rounded-lg bg-muted" />
        <div className="h-24 rounded-lg bg-muted" />
        <div className="h-24 rounded-lg bg-muted" />
        <div className="h-24 rounded-lg bg-muted" />
        <div className="h-24 rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <Suspense fallback={<AccountPageSkeleton />}>
        <AccountPageClientServer />
      </Suspense>
    </MainLayout>
  );
}

async function AccountPageClientServer() {
  const meRes = await callServerApi('USER_GET_ME', {});

  if (meRes.type === 'error') {
    const responseCode = meRes.error?.responseCode;
    return (
      <AccountPageClient
        user={null}
        errorMessage={responseCode === 401 ? null : meRes.message || 'Unable to load account.'}
      />
    );
  }

  return <AccountPageClient user={meRes.data.user} errorMessage={null} />;
}
