import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AccountWishlistPageClient } from '@/components/section/account/AccountWishlistPageClient';
import type { Metadata } from 'next';
import { callServerApi } from '@/lib/services/serverApi';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Your saved items and wishlist.',
};

function AccountWishlistPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-4">
      <div className="h-7 w-32 rounded-md bg-muted" />
      <div className="space-y-3 mt-4">
        <div className="h-24 w-full rounded-lg bg-muted" />
        <div className="h-24 w-full rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default function AccountWishlistPage() {
  return (
    <MainLayout hideHeader hideFooter>
      <Suspense fallback={<AccountWishlistPageSkeleton />}>
        <AccountWishlistPageClientServer />
      </Suspense>
    </MainLayout>
  );
}

async function AccountWishlistPageClientServer() {
  const res = await callServerApi('USER_WISHLIST_LIST', {});

  if (res.type === 'error') {
    const responseCode = res.error?.responseCode;
    return (
      <AccountWishlistPageClient
        initialItems={[]}
        initialPagination={{ page: 1, limit: 20, total: 0, totalPages: 1 }}
        initialLoadError={responseCode === 401 ? null : res.message || 'Unable to load wishlist.'}
      />
    );
  }

  return (
    <AccountWishlistPageClient
      initialItems={res.data.items}
      initialPagination={res.data.pagination}
      initialLoadError={null}
    />
  );
}
