import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Skeleton } from '@/components/ui/skeleton';
import { VendorEditProductPageClient } from '@/components/section/account/vendor/VendorEditProductPageClient';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Edit Product - Vendor',
  description: 'Edit your product.',
};

function EditProductSkeleton() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-4">
      <Skeleton className="h-8 w-40 rounded-md" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditVendorProductPage({ params }: PageProps) {
  return (
    <Suspense fallback={<EditProductSkeleton />}>
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
