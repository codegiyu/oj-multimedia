import { Suspense } from 'react';
import { AccountPageClient } from '@/components/section/account/AccountPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Manage your account and preferences.',
};

function AccountPageSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountPageSkeleton />}>
      <AccountPageClientServer />
    </Suspense>
  );
}

async function AccountPageClientServer() {
  const [meRes, ordersRes, wishlistRes] = await Promise.all([
    callServerApi('USER_GET_ME', {}),
    callServerApi('MARKETPLACE_GET_MY_ORDERS', { query: '?page=1&limit=5' }),
    callServerApi('USER_WISHLIST_LIST', {}),
  ]);

  if (meRes.type === 'error') {
    const responseCode = meRes.error?.responseCode;
    return (
      <AccountPageClient
        user={null}
        errorMessage={responseCode === 401 ? null : meRes.message || 'Unable to load account.'}
        ordersTotal={0}
        wishlistTotal={0}
        recentOrders={[]}
        wishlistPreview={[]}
      />
    );
  }

  const ordersTotal =
    ordersRes.type === 'success'
      ? (ordersRes.data.pagination?.total ?? ordersRes.data.orders.length)
      : 0;
  const recentOrders = ordersRes.type === 'success' ? ordersRes.data.orders.slice(0, 3) : [];

  const wishlistTotal =
    wishlistRes.type === 'success'
      ? (wishlistRes.data.pagination?.total ?? wishlistRes.data.items.length)
      : 0;
  const wishlistPreview = wishlistRes.type === 'success' ? wishlistRes.data.items.slice(0, 4) : [];

  return (
    <AccountPageClient
      user={meRes.data.user}
      errorMessage={null}
      ordersTotal={ordersTotal}
      wishlistTotal={wishlistTotal}
      recentOrders={recentOrders}
      wishlistPreview={wishlistPreview}
    />
  );
}
