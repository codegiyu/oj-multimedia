import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminProfilePageClient } from '@/components/section/admin/profile/AdminProfilePageClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { callServerApi } from '@/lib/services/serverApi';

export const metadata: Metadata = {
  title: 'My profile',
  description: 'View and update your admin profile',
};

function ProfilePageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading profile…</p>
      </div>
    </div>
  );
}

export default function AdminProfilePage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<ProfilePageFallback />}>
        <AdminProfilePageServer />
      </Suspense>
    </DashboardLayout>
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
