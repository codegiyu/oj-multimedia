import { Suspense } from 'react';
import type { Metadata } from 'next';
import { VendorNewProductPageClient } from '@/components/section/account/vendor/VendorNewProductPageClient';
import { VendorProductFormPageSkeleton } from '@/components/section/account/skeletons';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Add Product - Vendor',
  description: 'Add a new product to your vendor store.',
};

export default function NewVendorProductPage() {
  return (
    <Suspense fallback={<VendorProductFormPageSkeleton />}>
      <NewVendorProductPageServer />
    </Suspense>
  );
}

async function NewVendorProductPageServer() {
  const res = await callServerApi('VENDOR_GET_ME', {});

  if (res.error || !res.data) {
    const responseCode = (res.error as ApiErrorResponse | undefined)?.responseCode;
    if (responseCode === 403 || responseCode === 404) {
      return null;
    }
  }

  return <VendorNewProductPageClient />;
}
