import {
  MarketplacePageClient,
  type MarketplaceTabType,
} from '@/components/section/admin/marketplace/MarketplacePageClient';
import type {
  IMarketplaceProduct,
  IMarketplaceVendor,
  PopulatedMarketplaceOrder,
} from '@/lib/constants/endpoints';
import {
  serverFetchAdminOrdersList,
  serverFetchAdminProductsList,
  serverFetchAdminVendorsList,
} from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams, parseTabParam } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminMarketplacePageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Manage vendors, products, and orders',
};

const TAB_VENDORS = 'vendors';
const TAB_PRODUCTS = 'products';
const TAB_ORDERS = 'orders';

function parseMarketplaceTab(
  raw: Record<string, string | string[] | undefined>
): MarketplaceTabType {
  const tab = parseTabParam(raw, 'tab', TAB_VENDORS);
  if (tab === TAB_PRODUCTS || tab === TAB_ORDERS) {
    return tab;
  }

  return TAB_VENDORS;
}

interface MarketplacePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function MarketplacePage({ searchParams }: MarketplacePageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <Suspense fallback={<AdminMarketplacePageSkeleton />}>
          <AdminMarketplacePageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function AdminMarketplacePageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const tab = parseMarketplaceTab(raw);
  const listParams = parseAdminContentListParams(raw);

  let vendors: IMarketplaceVendor[] = [];
  let products: IMarketplaceProduct[] = [];
  let orders: PopulatedMarketplaceOrder[] = [];
  let totalPages = 1;
  let listError: string | null = null;

  if (tab === TAB_VENDORS) {
    const r = await serverFetchAdminVendorsList(listParams);
    vendors = r.items;
    totalPages = r.totalPages;
    listError = r.listError;
  } else if (tab === TAB_PRODUCTS) {
    const r = await serverFetchAdminProductsList(listParams);
    products = r.items;
    totalPages = r.totalPages;
    listError = r.listError;
  } else {
    const r = await serverFetchAdminOrdersList(listParams);
    orders = r.items;
    totalPages = r.totalPages;
    listError = r.listError;
  }

  return (
    <MarketplacePageClient
      pageTitle="Marketplace"
      pageDescription="Manage vendors, products, and orders"
      serverTab={tab}
      vendors={vendors}
      products={products}
      orders={orders}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
