'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  MusicCardSkeleton,
  VideoCardSkeleton,
  ProductCardSkeleton,
  AlbumCardSkeleton,
} from '@/components/skeletons';
import { TableContentSkeleton } from '@/components/general/TableContentSkeleton';
import type { DataTableColumn } from '@/components/general/DataTable';
import {
  AccountPageShell,
  DashboardPageHeaderSkeleton,
  DashboardStatGridSkeleton,
  DashboardQuickLinkGridSkeleton,
  DashboardFormCardSkeleton,
  FilterableDataPageSkeleton,
  AccountStatusPillsSkeleton,
  AccountOrderCardSkeleton,
  DashboardListRowSkeleton,
  VendorChartSkeleton,
  CardGridSkeleton,
} from './DashboardSkeletons';

const vendorOrderColumns: DataTableColumn<Record<string, unknown>, unknown>[] = [
  { id: 'order', header: 'Order', cell: () => null, meta: { width: 120 } },
  { id: 'customer', header: 'Customer', cell: () => null, meta: { width: 160 } },
  { id: 'product', header: 'Product', cell: () => null, meta: { width: 180 } },
  { id: 'qty', header: 'Qty', cell: () => null, meta: { width: 64, hug: true } },
  { id: 'amount', header: 'Amount', cell: () => null, meta: { width: 100 } },
  { id: 'status', header: 'Status', cell: () => null, meta: { width: 100 } },
  { id: 'date', header: 'Date', cell: () => null, meta: { width: 120 } },
  { id: 'actions', header: 'Actions', cell: () => null, meta: { width: 100, hug: true } },
];

export function AccountOrdersPageSkeleton() {
  return (
    <AccountPageShell label="Loading orders">
      <DashboardPageHeaderSkeleton />
      <FilterableDataPageSkeleton filterCount={1} />
      <DashboardStatGridSkeleton count={4} gridClassName="grid grid-cols-2 gap-4 lg:grid-cols-4" />
      <AccountStatusPillsSkeleton />
      <AccountOrderCardSkeleton count={3} />
    </AccountPageShell>
  );
}

export function AccountFavoritesPageSkeleton() {
  return (
    <AccountPageShell label="Loading favorites">
      <DashboardPageHeaderSkeleton actionCount={1} />
      {[1, 2].map(section => (
        <div key={section} className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <CardGridSkeleton
            count={3}
            gridClassName="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section === 1 ? <MusicCardSkeleton /> : <VideoCardSkeleton />}
          </CardGridSkeleton>
        </div>
      ))}
    </AccountPageShell>
  );
}

export function AccountWishlistPageSkeleton() {
  return (
    <AccountPageShell label="Loading wishlist">
      <DashboardPageHeaderSkeleton actionCount={1} />
      <CardGridSkeleton
        count={6}
        gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProductCardSkeleton />
      </CardGridSkeleton>
    </AccountPageShell>
  );
}

export function AccountSettingsPageSkeleton() {
  return (
    <AccountPageShell label="Loading settings" className="mx-auto max-w-3xl space-y-8">
      <DashboardPageHeaderSkeleton />
      <DashboardFormCardSkeleton fieldRows={4} />
      <DashboardFormCardSkeleton fieldRows={3} />
    </AccountPageShell>
  );
}

export function ArtistPortalContentListPageSkeleton() {
  return (
    <AccountPageShell label="Loading content" className="space-y-6">
      <DashboardPageHeaderSkeleton actionCount={2} />
      <FilterableDataPageSkeleton filterCount={0} />
      <AccountStatusPillsSkeleton count={4} />
      <DashboardListRowSkeleton count={4} />
    </AccountPageShell>
  );
}

export function ArtistPortalAlbumsPageSkeleton() {
  return (
    <AccountPageShell label="Loading albums" className="space-y-6">
      <DashboardPageHeaderSkeleton actionCount={1} />
      <CardGridSkeleton
        count={8}
        gridClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <div className="space-y-2">
          <AlbumCardSkeleton />
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      </CardGridSkeleton>
    </AccountPageShell>
  );
}

export function ArtistPortalUploadPageSkeleton() {
  return (
    <AccountPageShell label="Loading upload" className="mx-auto max-w-2xl space-y-6">
      <DashboardPageHeaderSkeleton />
      <div className="rounded-xl border border-border/50 bg-card p-6 md:p-8 space-y-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-11 w-40 rounded-md" />
      </div>
    </AccountPageShell>
  );
}

export function ArtistPortalSettingsPageSkeleton() {
  return (
    <AccountPageShell label="Loading artist settings" className="mx-auto max-w-3xl space-y-6">
      <DashboardPageHeaderSkeleton />
      <DashboardFormCardSkeleton fieldRows={8} />
    </AccountPageShell>
  );
}

export function VendorDashboardPageSkeleton() {
  return (
    <AccountPageShell label="Loading vendor dashboard" className="space-y-8">
      <DashboardPageHeaderSkeleton />
      <DashboardStatGridSkeleton count={4} />
      <VendorChartSkeleton />
      <DashboardQuickLinkGridSkeleton
        count={3}
        gridClassName="grid grid-cols-1 gap-4 md:grid-cols-3"
      />
    </AccountPageShell>
  );
}

export function VendorOrdersPageSkeleton() {
  return (
    <AccountPageShell label="Loading vendor orders">
      <DashboardPageHeaderSkeleton />
      <FilterableDataPageSkeleton filterCount={1} />
      <DashboardStatGridSkeleton count={4} gridClassName="grid grid-cols-2 gap-4 lg:grid-cols-4" />
      <AccountStatusPillsSkeleton />
      <TableContentSkeleton columns={vendorOrderColumns} rowCount={6} onRefresh={() => {}} />
    </AccountPageShell>
  );
}

export function VendorProductsPageSkeleton() {
  return (
    <AccountPageShell label="Loading vendor products">
      <DashboardPageHeaderSkeleton actionCount={1} />
      <FilterableDataPageSkeleton filterCount={2} />
      <CardGridSkeleton
        count={6}
        gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <ProductCardSkeleton />
      </CardGridSkeleton>
    </AccountPageShell>
  );
}

export function VendorProductFormPageSkeleton() {
  return (
    <AccountPageShell label="Loading product form" className="mx-auto max-w-3xl space-y-6">
      <DashboardPageHeaderSkeleton />
      <DashboardFormCardSkeleton fieldRows={10} />
      <div className="flex gap-3">
        <Skeleton className="h-11 w-32 rounded-md" />
        <Skeleton className="h-11 w-28 rounded-md" />
      </div>
    </AccountPageShell>
  );
}

export function VendorSettingsPageSkeleton() {
  return (
    <AccountPageShell label="Loading vendor settings" className="mx-auto max-w-3xl space-y-8">
      <DashboardPageHeaderSkeleton />
      <DashboardFormCardSkeleton fieldRows={2} />
      <DashboardFormCardSkeleton fieldRows={5} />
      <DashboardFormCardSkeleton fieldRows={4} />
      <DashboardFormCardSkeleton fieldRows={4} />
      <Skeleton className="h-11 w-36 rounded-md" />
    </AccountPageShell>
  );
}

export function PastorPortalSettingsPageSkeleton() {
  return (
    <AccountPageShell label="Loading pastor settings" className="mx-auto max-w-3xl space-y-6">
      <DashboardPageHeaderSkeleton />
      <DashboardFormCardSkeleton fieldRows={8} />
    </AccountPageShell>
  );
}

export function DashboardQuestionDetailSkeleton() {
  return (
    <AccountPageShell label="Loading question" className="space-y-6">
      <Skeleton className="h-9 w-32" />
      <DashboardPageHeaderSkeleton />
      <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
        <Skeleton className="h-32 w-full rounded-md" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
    </AccountPageShell>
  );
}

export const PastorQuestionDetailSkeleton = DashboardQuestionDetailSkeleton;
export const AccountCommunityQuestionDetailSkeleton = DashboardQuestionDetailSkeleton;
