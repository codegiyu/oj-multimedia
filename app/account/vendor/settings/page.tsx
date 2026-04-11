import { Suspense } from 'react';
import { VendorSettingsPageClient } from '@/components/section/account/vendor/VendorSettingsPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Vendor Settings',
  description: 'Update your vendor store settings.',
};

function VendorSettingsPageSkeleton() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-4">
      <Skeleton className="h-7 w-48 rounded-md" />
      <Skeleton className="h-4 w-32 rounded-md" />
      <div className="space-y-3 mt-4">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    </div>
  );
}

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
      return <VendorSettingsPageClient initialVendor={null} initialHasVendorProfile={false} />;
    }

    // Show the page but mark as vendor (so the form shows) with empty defaults.
    return (
      <VendorSettingsPageClient
        initialVendor={null}
        initialHasVendorProfile={true}
        initialLoadError={res.message || "We couldn't load your settings."}
      />
    );
  }

  return (
    <VendorSettingsPageClient
      initialVendor={res.data}
      initialHasVendorProfile={true}
      initialLoadError={null}
    />
  );
}
