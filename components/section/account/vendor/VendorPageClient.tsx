'use client';

import Link from 'next/link';
import { DashboardPageHeader, DashboardStatCard } from '@/components/layout/user-dashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag, CreditCard, Settings, ArrowRight, TrendingUp } from 'lucide-react';
import type { IVendorDashboardStatsRes, IVendorMeRes } from '@/lib/constants/endpoints';
import { formatPrice } from '@/lib/utils/marketplace';
import { VendorDashboardCharts } from './VendorDashboardCharts';

export interface VendorPageClientProps {
  vendor: IVendorMeRes | null;
  stats: IVendorDashboardStatsRes | null;
  errorMessage: string | null;
}

export function VendorPageClient({ vendor, stats, errorMessage }: VendorPageClientProps) {
  const productsCount = stats?.productsCount ?? 0;
  const pendingOrdersCount = stats?.pendingOrdersCount ?? 0;
  const revenue = stats?.totalPaidRevenue ?? 0;
  const storeStatus = vendor?.status
    ? vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)
    : 'Unknown';

  return (
    <div className="max-w-6xl space-y-8">
      <DashboardPageHeader
        title="Overview"
        description="Sales and orders at a glance for your store.">
        {vendor?.slug ? (
          <Button asChild variant="outline" className="rounded-full px-5">
            <Link href={`/marketplace/vendors/${vendor.slug}`} className="gap-2">
              View public store
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </DashboardPageHeader>

      {errorMessage && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {vendor?.storeName && (
        <p className="-mt-4 text-sm text-muted-foreground">
          Managing <span className="font-semibold text-foreground">{vendor.storeName}</span>
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          label="Total sales"
          value={formatPrice(revenue)}
          hint={revenue > 0 ? 'From paid orders' : 'No paid orders yet'}
          icon={CreditCard}
          corner={<TrendingUp className="h-4 w-4 text-emerald-600" aria-hidden />}
        />
        <DashboardStatCard
          label="Products"
          value={productsCount}
          hint="In your catalogue"
          icon={Package}
        />
        <DashboardStatCard
          label="Pending orders"
          value={pendingOrdersCount}
          valueClassName="text-amber-600 dark:text-amber-400"
          hint="Needs attention"
          icon={ShoppingBag}
        />
        <DashboardStatCard
          label="Store health"
          value={storeStatus}
          hint={vendor?.status === 'active' ? 'Store is live' : 'Review your store status'}
          icon={Settings}
        />
      </div>

      <VendorDashboardCharts stats={stats} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-border/80 p-6 shadow-sm transition-shadow hover:shadow-md">
          <Package className="mb-3 h-9 w-9 text-primary" />
          <h3 className="font-semibold text-foreground">Products</h3>
          <p className="mt-1 text-sm text-muted-foreground">Add, edit, or archive listings.</p>
          <Button asChild className="mt-4 rounded-full bg-primary hover:bg-primary/90">
            <Link href="/account/vendor/products" className="gap-2">
              Manage products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
        <Card className="border-border/80 p-6 shadow-sm transition-shadow hover:shadow-md">
          <ShoppingBag className="mb-3 h-9 w-9 text-primary" />
          <h3 className="font-semibold text-foreground">Orders</h3>
          <p className="mt-1 text-sm text-muted-foreground">Review customer orders.</p>
          <Button asChild variant="outline" className="mt-4 rounded-full gap-2">
            <Link href="/account/vendor/orders">
              View orders
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
        <Card className="border-border/80 p-6 shadow-sm transition-shadow hover:shadow-md">
          <Settings className="mb-3 h-9 w-9 text-primary" />
          <h3 className="font-semibold text-foreground">Settings</h3>
          <p className="mt-1 text-sm text-muted-foreground">Store profile and payouts.</p>
          <Button asChild variant="outline" className="mt-4 rounded-full gap-2">
            <Link href="/account/vendor/settings">
              Open settings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
