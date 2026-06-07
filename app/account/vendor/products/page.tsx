import { Suspense } from 'react';
import { VendorProductsPageClient } from '@/components/section/account/vendor/VendorProductsPageClient';
import { VendorProductsPageSkeleton } from '@/components/section/account/skeletons';
import type { Metadata } from 'next';
import { buildAccountVendorProductsQuery } from '@/lib/account/accountListFilters';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';
import { parseAccountVendorProductsPageParams } from '@/lib/utils/accountSearchParams';

export const metadata: Metadata = {
  title: 'Vendor Products',
  description: 'Manage your vendor products.',
};

interface VendorProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function VendorProductsPage({ searchParams }: VendorProductsPageProps) {
  return (
    <Suspense fallback={<VendorProductsPageSkeleton />}>
      <VendorProductsPageClientServer searchParams={searchParams} />
    </Suspense>
  );
}

async function VendorProductsPageClientServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const { page, pageSize, status, category, search } = parseAccountVendorProductsPageParams(raw);
  const query =
    `?${buildAccountVendorProductsQuery({ page, pageSize, status, category, search }).toString()}` as const;
  const res = await callServerApi('VENDOR_GET_PRODUCTS', { query });

  if (res.error || !res.data) {
    const responseCode = (res.error as ApiErrorResponse | undefined)?.responseCode;

    if (responseCode === 403 || responseCode === 404) {
      return null;
    }

    return (
      <VendorProductsPageClient
        initialProducts={[]}
        initialTotalPages={1}
        initialErrorMessage={res.message || 'Unable to load products.'}
      />
    );
  }

  return (
    <VendorProductsPageClient
      initialProducts={res.data.products}
      initialTotalPages={res.data.pagination.totalPages || 1}
      initialErrorMessage={null}
    />
  );
}
