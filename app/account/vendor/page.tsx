import { Suspense } from 'react';
import { VendorPageClient } from '@/components/section/account/vendor/VendorPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';
import type { IVendorDashboardStatsRes, IVendorMeRes } from '@/lib/constants/endpoints';

export const metadata: Metadata = {
  title: 'Vendor Dashboard',
  description: 'Manage your vendor account and store.',
};

function VendorDashboardSkeleton() {
  return (
    <div className="max-w-5xl mx-auto py-8 space-y-4">
      <Skeleton className="h-7 w-40 rounded-md" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function VendorPage() {
  return (
    <Suspense fallback={<VendorDashboardSkeleton />}>
      <VendorPageClientServer />
    </Suspense>
  );
}

async function VendorPageClientServer() {
  const meRes = await callServerApi('VENDOR_GET_ME', {});

  if (meRes.type === 'error') {
    const responseCode = meRes.error?.responseCode;

    if (responseCode === 403 || responseCode === 404) {
      return null;
    }

    return (
      <VendorPageClient
        vendor={null}
        stats={null}
        errorMessage={meRes.message || 'Unable to load vendor profile.'}
      />
    );
  }

  const vendor: IVendorMeRes = meRes.data;
  const statsRes = await callServerApi('VENDOR_GET_DASHBOARD_STATS', {});

  const stats: IVendorDashboardStatsRes | null = statsRes.type === 'success' ? statsRes.data : null;

  return (
    <VendorPageClient
      vendor={vendor}
      stats={stats}
      errorMessage={
        statsRes.type === 'error' ? statsRes.message || 'Unable to load dashboard stats.' : null
      }
    />
  );
}
