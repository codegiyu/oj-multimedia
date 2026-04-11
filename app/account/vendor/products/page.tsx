import { Suspense } from 'react';
import { VendorProductsPageClient } from '@/components/section/account/vendor/VendorProductsPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Vendor Products',
  description: 'Manage your vendor products.',
};

function VendorProductsPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto py-8 space-y-4">
      <Skeleton className="h-7 w-40 rounded-md" />
      <Skeleton className="h-10 w-48 rounded-md" />
      <div className="space-y-3 mt-4">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function VendorProductsPage({
  searchParams,
}: {
  searchParams?: { page?: string; pagesize?: string };
}) {
  const page = Number(searchParams?.page ?? 1) || 1;
  const pageSize = Number(searchParams?.pagesize ?? 10) || 10;

  return (
    <Suspense fallback={<VendorProductsPageSkeleton />}>
      <VendorProductsPageClientServer page={page} pageSize={pageSize} />
    </Suspense>
  );
}

async function VendorProductsPageClientServer({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  const query = `?page=${page}&limit=${pageSize}` as const;
  const res = await callServerApi('VENDOR_GET_PRODUCTS', { query });

  if (res.error || !res.data) {
    const responseCode = (res.error as ApiErrorResponse | undefined)?.responseCode;

    if (responseCode === 403 || responseCode === 404) {
      return (
        <VendorProductsPageClient
          initialProducts={[]}
          initialTotalPages={1}
          initialHasVendorProfile={false}
          initialErrorMessage={null}
        />
      );
    }

    return (
      <VendorProductsPageClient
        initialProducts={[]}
        initialTotalPages={1}
        initialHasVendorProfile={true}
        initialErrorMessage={res.message || 'Unable to load products.'}
      />
    );
  }

  return (
    <VendorProductsPageClient
      initialProducts={res.data.products}
      initialTotalPages={res.data.pagination.totalPages || 1}
      initialHasVendorProfile={true}
      initialErrorMessage={null}
    />
  );
}
