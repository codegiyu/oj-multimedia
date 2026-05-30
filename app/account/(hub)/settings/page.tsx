import { Suspense } from 'react';
import { AccountSettingsPageClient } from '@/components/section/account/AccountSettingsPageClient';
import { AccountSettingsPageSkeleton } from '@/components/section/account/skeletons';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Update your account settings and preferences.',
};

export default function AccountSettingsPage() {
  return (
    <Suspense fallback={<AccountSettingsPageSkeleton />}>
      <AccountSettingsPageClientServer />
    </Suspense>
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
          responseCode === 401
            ? 'Your session has expired. Please sign in again to update your settings.'
            : res.message || "We couldn't load your profile."
        }
      />
    );
  }

  return <AccountSettingsPageClient initialUser={res.data.user} initialLoadError={null} />;
}
