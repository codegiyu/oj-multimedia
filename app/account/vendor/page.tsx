import { Suspense } from 'react';
import { VendorPageClient } from '@/components/section/account/vendor/VendorPageClient';
import { VendorDashboardPageSkeleton } from '@/components/section/account/skeletons';
import { DashboardPortalForbiddenFallback } from '@/components/section/account/shared/DashboardPortalForbiddenFallback';
import type { Metadata } from 'next';
import { isPortalForbiddenCode } from '@/lib/account/rolePortalAccess';
import { callServerApi } from '@/lib/services/serverApi';
import type { IVendorDashboardStatsRes, IVendorMeRes } from '@/lib/constants/endpoints';

export const metadata: Metadata = {
  title: 'Vendor Dashboard',
  description: 'Manage your vendor account and store.',
};

export default function VendorPage() {
  return (
    <Suspense fallback={<VendorDashboardPageSkeleton />}>
      <VendorPageClientServer />
    </Suspense>
  );
}

async function VendorPageClientServer() {
  const meRes = await callServerApi('VENDOR_GET_ME', {});

  if (meRes.type === 'error') {
    const responseCode = meRes.error?.responseCode;

    if (isPortalForbiddenCode(responseCode)) {
      return (
        <DashboardPortalForbiddenFallback
          message={meRes.message || 'Unable to load vendor profile.'}
        />
      );
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
