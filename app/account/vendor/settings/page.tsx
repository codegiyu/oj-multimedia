import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { VendorSettingsPageClient } from '@/components/section/account/vendor/VendorSettingsPageClient';
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
      <div className="h-7 w-48 rounded-md bg-muted" />
      <div className="h-4 w-32 rounded-md bg-muted" />
      <div className="space-y-3 mt-4">
        <div className="h-20 w-full rounded-lg bg-muted" />
        <div className="h-20 w-full rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default function VendorSettingsPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <Suspense fallback={<VendorSettingsPageSkeleton />}>
        <VendorSettingsPageClientServer />
      </Suspense>
    </MainLayout>
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
