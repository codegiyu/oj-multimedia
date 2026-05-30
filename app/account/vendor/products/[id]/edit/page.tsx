import { Suspense } from 'react';
import type { Metadata } from 'next';
import { VendorEditProductPageClient } from '@/components/section/account/vendor/VendorEditProductPageClient';
import { VendorProductFormPageSkeleton } from '@/components/section/account/skeletons';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Edit Product - Vendor',
  description: 'Edit your product.',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditVendorProductPage({ params }: PageProps) {
  return (
    <Suspense fallback={<VendorProductFormPageSkeleton />}>
      <EditVendorProductPageServer params={params} />
    </Suspense>
  );
}

async function EditVendorProductPageServer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await callServerApi('VENDOR_GET_ME', {});

  if (res.error || !res.data) {
    const responseCode = (res.error as ApiErrorResponse | undefined)?.responseCode;
    if (responseCode === 403 || responseCode === 404) {
      return null;
    }
  }

  return <VendorEditProductPageClient productId={id} />;
}
