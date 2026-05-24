import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MarketplacePageClient } from '@/components/section/admin/marketplace/MarketplacePageClient';
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
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Manage vendors, products, and orders',
};

const TAB_VENDORS = 'vendors';
const TAB_PRODUCTS = 'products';

function MarketplacePageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading marketplace...</p>
      </div>
    </div>
  );
}

interface MarketplacePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function MarketplacePage({ searchParams }: MarketplacePageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<MarketplacePageFallback />}>
            <AdminMarketplacePageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminMarketplacePageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const tab = parseTabParam(raw, 'tab', TAB_VENDORS);
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
      vendors={vendors}
      products={products}
      orders={orders}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
