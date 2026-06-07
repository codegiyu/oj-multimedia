import { AdminProfilePageClient } from '@/components/section/admin/profile/AdminProfilePageClient';
import { Metadata } from 'next';
import { AdminProfilePageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';
import { callServerApi } from '@/lib/services/serverApi';

export const metadata: Metadata = {
  title: 'My profile',
  description: 'View and update your admin profile',
};

export default function AdminProfilePage() {
  return (
    <Suspense fallback={<AdminProfilePageSkeleton />}>
      <AdminProfilePageServer />
    </Suspense>
  );
}

async function AdminProfilePageServer() {
  const res = await callServerApi('ADMIN_GET_ME', {});

  if (res.type === 'error') {
    const responseCode = res.error?.responseCode;
    return (
      <AdminProfilePageClient
        initialUser={null}
        initialLoadError={
          responseCode === 401
            ? 'Your session has expired. Please sign in again to manage your profile.'
            : res.message || "We couldn't load your profile."
        }
      />
    );
  }

  return <AdminProfilePageClient initialUser={res.data.user} initialLoadError={null} />;
}
