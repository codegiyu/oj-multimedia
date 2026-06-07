import { Suspense } from 'react';
import { VendorOrdersPageClient } from '@/components/section/account/vendor/VendorOrdersPageClient';
import { VendorOrdersPageSkeleton } from '@/components/section/account/skeletons';
import type { Metadata } from 'next';
import { buildAccountOrdersQuery } from '@/lib/account/accountListFilters';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import { parseAccountListPageParams } from '@/lib/utils/accountSearchParams';

export const metadata: Metadata = {
  title: 'Vendor Orders',
  description: 'View and manage your vendor orders.',
};

interface VendorOrdersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function VendorOrdersPage({ searchParams }: VendorOrdersPageProps) {
  return (
    <Suspense fallback={<VendorOrdersPageSkeleton />}>
      <VendorOrdersPageClientServer searchParams={searchParams} />
    </Suspense>
  );
}

async function VendorOrdersPageClientServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const { page, pageSize, status, search } = parseAccountListPageParams(raw);
  const query =
    `?${buildAccountOrdersQuery({ page, pageSize, status, search }).toString()}` as const;
  const res = await callServerApi('VENDOR_GET_ORDERS', { query });

  if (res.error || !res.data) {
    const responseCode = (res.error as ApiErrorResponse | undefined)?.responseCode;

    if (responseCode === 403 || responseCode === 404) {
      return null;
    }

    return (
      <VendorOrdersPageClient
        initialOrders={[]}
        initialTotalPages={1}
        initialErrorMessage={res.message || 'Unable to load orders.'}
      />
    );
  }

  return (
    <VendorOrdersPageClient
      initialOrders={res.data.orders}
      initialTotalPages={res.data.pagination.totalPages || 1}
      initialErrorMessage={null}
    />
  );
}
