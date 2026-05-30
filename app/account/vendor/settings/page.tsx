import { Suspense } from 'react';
import { VendorSettingsPageClient } from '@/components/section/account/vendor/VendorSettingsPageClient';
import { VendorSettingsPageSkeleton } from '@/components/section/account/skeletons';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Vendor Settings',
  description: 'Update your vendor store settings.',
};

export default function VendorSettingsPage() {
  return (
    <Suspense fallback={<VendorSettingsPageSkeleton />}>
      <VendorSettingsPageClientServer />
    </Suspense>
  );
}

async function VendorSettingsPageClientServer() {
  const res = await callServerApi('VENDOR_GET_ME', {});

  if (res.error || !res.data) {
    const responseCode = (res.error as ApiErrorResponse | undefined)?.responseCode;

    if (responseCode === 403 || responseCode === 404) {
      return null;
    }

    return (
      <VendorSettingsPageClient
        initialVendor={null}
        initialLoadError={res.message || "We couldn't load your settings."}
      />
    );
  }

  return <VendorSettingsPageClient initialVendor={res.data} initialLoadError={null} />;
}
