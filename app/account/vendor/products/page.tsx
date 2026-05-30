import { Suspense } from 'react';
import { VendorProductsPageClient } from '@/components/section/account/vendor/VendorProductsPageClient';
import { VendorProductsPageSkeleton } from '@/components/section/account/skeletons';
import type { Metadata } from 'next';
import { buildAccountVendorProductsQuery } from '@/lib/account/accountListFilters';
import { callServerApi } from '@/lib/services/serverApi';
import type { ApiErrorResponse } from '@/lib/types/http';

export const metadata: Metadata = {
  title: 'Vendor Products',
  description: 'Manage your vendor products.',
};

export default function VendorProductsPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    pagesize?: string;
    status?: string;
    category?: string;
    search?: string;
  };
}) {
  const page = Number(searchParams?.page ?? 1) || 1;
  const pageSize = Number(searchParams?.pagesize ?? 10) || 10;
  const status = searchParams?.status ?? 'all';
  const category = searchParams?.category ?? 'all';
  const search = searchParams?.search ?? '';

  return (
    <Suspense fallback={<VendorProductsPageSkeleton />}>
      <VendorProductsPageClientServer
        page={page}
        pageSize={pageSize}
        status={status}
        category={category}
        search={search}
      />
    </Suspense>
  );
}

async function VendorProductsPageClientServer({
  page,
  pageSize,
  status,
  category,
  search,
}: {
  page: number;
  pageSize: number;
  status: string;
  category: string;
  search: string;
}) {
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
