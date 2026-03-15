import { Suspense } from 'react';
import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
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
      <div className="h-8 w-48 rounded-md bg-muted" />
      <div className="h-64 rounded-lg bg-muted" />
    </div>
  );
}

export default function NewVendorProductPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <Suspense fallback={<NewProductSkeleton />}>
        <NewVendorProductPageServer />
      </Suspense>
    </MainLayout>
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
