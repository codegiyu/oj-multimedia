import { Suspense } from 'react';
import { AccountOrdersPageClient } from '@/components/section/account/AccountOrdersPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { buildAccountOrdersQuery } from '@/lib/account/accountListFilters';
import { callServerApi } from '@/lib/services/serverApi';

export const metadata: Metadata = {
  title: 'Orders',
  description: 'View and manage your orders.',
};

function AccountOrdersPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-4">
      <Skeleton className="h-7 w-40 rounded-md" />
      <div className="space-y-3 mt-4">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function AccountOrdersPage({
  searchParams,
}: {
  searchParams?: { page?: string; pagesize?: string; status?: string; search?: string };
}) {
  const page = Number(searchParams?.page ?? 1) || 1;
  const pageSize = Number(searchParams?.pagesize ?? 10) || 10;
  const status = searchParams?.status ?? '';
  const search = searchParams?.search ?? '';

  return (
    <Suspense fallback={<AccountOrdersPageSkeleton />}>
      <AccountOrdersPageClientServer
        page={page}
        pageSize={pageSize}
        status={status}
        search={search}
      />
    </Suspense>
  );
}

async function AccountOrdersPageClientServer({
  page,
  pageSize,
  status,
  search,
}: {
  page: number;
  pageSize: number;
  status: string;
  search: string;
}) {
  const query =
    `?${buildAccountOrdersQuery({ page, pageSize, search, status }).toString()}` as const;

  const res = await callServerApi('MARKETPLACE_GET_MY_ORDERS', { query });

  if (res.type === 'error') {
    const responseCode = res.error?.responseCode;
    return (
      <AccountOrdersPageClient
        initialOrders={[]}
        initialTotalPages={1}
        initialErrorMessage={responseCode === 401 ? null : res.message || 'Unable to load orders.'}
      />
    );
  }

  return (
    <AccountOrdersPageClient
      initialOrders={res.data.orders}
      initialTotalPages={res.data.pagination?.totalPages ?? 1}
      initialErrorMessage={null}
    />
  );
}
