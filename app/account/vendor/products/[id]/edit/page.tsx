import { Suspense } from 'react';
import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { VendorEditProductPageClient } from '@/components/section/account/vendor/VendorEditProductPageClient';
import { VendorCreateStoreState } from '@/components/section/account/vendor/VendorCreateStoreState';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Edit Product - Vendor',
  description: 'Edit your product.',
};

function EditProductSkeleton() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-4">
      <div className="h-8 w-40 rounded-md bg-muted" />
      <div className="h-64 rounded-lg bg-muted" />
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditVendorProductPage({ params }: PageProps) {
  return (
    <MainLayout hideHeader hideFooter>
      <Suspense fallback={<EditProductSkeleton />}>
        <EditVendorProductPageServer params={params} />
      </Suspense>
    </MainLayout>
  );
}

async function EditVendorProductPageServer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await callServerApi('VENDOR_GET_ME', {});

  if (res.error || !res.data) {
    const responseCode = (res.error as ApiErrorResponse | undefined)?.responseCode;
    if (responseCode === 403 || responseCode === 404) {
      return (
        <VendorCreateStoreState description="You need a vendor store before you can edit products. Become a vendor to start selling on the marketplace." />
      );
    }
  }

  return <VendorEditProductPageClient productId={id} />;
}
