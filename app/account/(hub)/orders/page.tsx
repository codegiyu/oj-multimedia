import { Suspense } from 'react';
import { AccountOrdersPageClient } from '@/components/section/account/AccountOrdersPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { buildAccountOrdersQuery } from '@/lib/account/accountListFilters';
import { callServerApi } from '@/lib/services/serverApi';
import { parseAccountListPageParams } from '@/lib/utils/accountSearchParams';

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

interface AccountOrdersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AccountOrdersPage({ searchParams }: AccountOrdersPageProps) {
  return (
    <Suspense fallback={<AccountOrdersPageSkeleton />}>
      <AccountOrdersPageServer searchParams={searchParams} />
    </Suspense>
  );
}

async function AccountOrdersPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const { page, pageSize, search, status } = parseAccountListPageParams(raw);
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
