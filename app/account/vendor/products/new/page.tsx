import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Skeleton } from '@/components/ui/skeleton';
import { VendorNewProductPageClient } from '@/components/section/account/vendor/VendorNewProductPageClient';
import { VendorCreateStoreState } from '@/components/section/account/vendor/VendorCreateStoreState';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Add Product - Vendor',
  description: 'Add a new product to your vendor store.',
};

function NewProductSkeleton() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-4">
      <Skeleton className="h-8 w-48 rounded-md" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

export default function NewVendorProductPage() {
  return (
    <Suspense fallback={<NewProductSkeleton />}>
      <NewVendorProductPageServer />
    </Suspense>
  );
}

async function NewVendorProductPageServer() {
  const res = await callServerApi('VENDOR_GET_ME', {});

  if (res.error || !res.data) {
    const responseCode = (res.error as ApiErrorResponse | undefined)?.responseCode;
    if (responseCode === 403 || responseCode === 404) {
      return (
        <VendorCreateStoreState description="You need a vendor store before you can add products. Become a vendor to start selling on the marketplace." />
      );
    }
  }

  return <VendorNewProductPageClient />;
}
