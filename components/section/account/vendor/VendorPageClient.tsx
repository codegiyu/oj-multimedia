'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingBag, CreditCard, Settings, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import {
  getMockProductsByVendorId,
  getMockOrdersByVendorId,
  formatPrice,
} from '@/lib/utils/marketplace';

const CURRENT_VENDOR_ID = 'v1';

export function VendorPageClient() {
  const products = getMockProductsByVendorId(CURRENT_VENDOR_ID);
  const orders = getMockOrdersByVendorId(CURRENT_VENDOR_ID);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed');
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <SectionContainer>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Vendor Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{products.length}</p>
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
                <p className="text-2xl font-bold text-foreground">{pendingOrders.length}</p>
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
                <p className="text-2xl font-bold text-primary">{formatPrice(totalRevenue)}</p>
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
