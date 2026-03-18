import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AccountOrdersPageClient } from '@/components/section/account/AccountOrdersPageClient';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';

export const metadata: Metadata = {
  title: 'Orders',
  description: 'View and manage your orders.',
};

function AccountOrdersPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-4">
      <div className="h-7 w-40 rounded-md bg-muted" />
      <div className="space-y-3 mt-4">
        <div className="h-24 w-full rounded-lg bg-muted" />
        <div className="h-24 w-full rounded-lg bg-muted" />
        <div className="h-24 w-full rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default function AccountOrdersPage({
  searchParams,
}: {
  searchParams?: { page?: string; pagesize?: string; status?: string };
}) {
  const page = Number(searchParams?.page ?? 1) || 1;
  const pageSize = Number(searchParams?.pagesize ?? 10) || 10;
  const status = searchParams?.status ?? '';

  return (
    <MainLayout hideHeader hideFooter>
      <Suspense fallback={<AccountOrdersPageSkeleton />}>
        <AccountOrdersPageClientServer page={page} pageSize={pageSize} status={status} />
      </Suspense>
    </MainLayout>
  );
}

async function AccountOrdersPageClientServer({
  page,
  pageSize,
  status,
}: {
  page: number;
  pageSize: number;
  status: string;
}) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(pageSize));
  if (status) params.set('status', status);
  const query = `?${params.toString()}` as const;

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
