'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag, CreditCard, Settings, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { IVendorDashboardStatsRes, IVendorMeRes } from '@/lib/constants/endpoints';
import { formatPrice } from '@/lib/utils/marketplace';
import { VendorCreateStoreState } from './VendorCreateStoreState';

export interface VendorPageClientProps {
  vendor: IVendorMeRes | null;
  stats: IVendorDashboardStatsRes | null;
  hasVendorProfile: boolean;
  errorMessage: string | null;
}

export function VendorPageClient({
  vendor,
  stats,
  hasVendorProfile,
  errorMessage,
}: VendorPageClientProps) {
  if (!hasVendorProfile) {
    return (
      <VendorCreateStoreState description="You do not have a vendor store yet. Become a vendor to start listing products and receive orders that are organized and sent to your WhatsApp." />
    );
  }

  return (
    <SectionContainer>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Vendor Dashboard</h1>
        {errorMessage && (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}
        {vendor?.storeName && (
          <p className="text-sm text-muted-foreground mb-6">
            Managing store <span className="font-semibold text-foreground">{vendor.storeName}</span>
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats?.productsCount ?? 0}</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.pendingOrdersCount ?? 0}
                </p>
                <p className="text-sm text-muted-foreground">Pending orders</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(stats?.totalPaidRevenue ?? 0)}
                </p>
                <p className="text-sm text-muted-foreground">Revenue (paid)</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Package className="w-10 h-10 text-primary mb-4" />
            <h2 className="font-semibold text-foreground mb-2">Manage products</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Add, edit, or archive your products.
            </p>
            <Button variant="default" className="gap-2 bg-primary hover:bg-primary/90" asChild>
              <Link href="/account/vendor/products">
                View products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <ShoppingBag className="w-10 h-10 text-primary mb-4" />
            <h2 className="font-semibold text-foreground mb-2">Orders</h2>
            <p className="text-sm text-muted-foreground mb-4">View and manage customer orders.</p>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/account/vendor/orders">
                View orders
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </Card>
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Settings className="w-10 h-10 text-primary mb-4" />
            <h2 className="font-semibold text-foreground mb-2">Settings</h2>
            <p className="text-sm text-muted-foreground mb-4">Store profile and payment details.</p>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/account/vendor/settings">
                Open settings
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </SectionContainer>
  );
}
