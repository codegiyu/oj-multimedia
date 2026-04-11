import { Suspense } from 'react';
import { VendorOrdersPageClient } from '@/components/section/account/vendor/VendorOrdersPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Vendor Orders',
  description: 'View and manage your vendor orders.',
};

function VendorOrdersPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto py-8 space-y-4">
      <Skeleton className="h-7 w-40 rounded-md" />
      <div className="space-y-3 mt-4">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function VendorOrdersPage({
  searchParams,
}: {
  searchParams?: { page?: string; pagesize?: string; status?: string };
}) {
  const page = Number(searchParams?.page ?? 1) || 1;
  const pageSize = Number(searchParams?.pagesize ?? 10) || 10;
  const status = searchParams?.status ?? '';

  return (
    <Suspense fallback={<VendorOrdersPageSkeleton />}>
      <VendorOrdersPageClientServer page={page} pageSize={pageSize} status={status} />
    </Suspense>
  );
}

async function VendorOrdersPageClientServer({
  page,
  pageSize,
  status,
}: {
  page: number;
  pageSize: number;
  status: string;
}) {
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(page));
  searchParams.set('limit', String(pageSize));
  if (status) searchParams.set('status', status);

  const res = await callServerApi('VENDOR_GET_ORDERS', { query: `?${searchParams.toString()}` });

  if (res.error || !res.data) {
    const responseCode = (res.error as ApiErrorResponse | undefined)?.responseCode;

    if (responseCode === 403 || responseCode === 404) {
      return (
        <VendorOrdersPageClient
          initialOrders={[]}
          initialTotalPages={1}
          initialHasVendorProfile={false}
          initialErrorMessage={null}
        />
      );
    }

    return (
      <VendorOrdersPageClient
        initialOrders={[]}
        initialTotalPages={1}
        initialHasVendorProfile={true}
        initialErrorMessage={res.message || 'Unable to load orders.'}
      />
    );
  }

  return (
    <VendorOrdersPageClient
      initialOrders={res.data.orders}
      initialTotalPages={res.data.pagination.totalPages || 1}
      initialHasVendorProfile={true}
      initialErrorMessage={null}
    />
  );
}
