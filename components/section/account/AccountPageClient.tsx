'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Package, Heart, Store, Settings, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function AccountPageClient() {
  return (
    <SectionContainer>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Account</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/account/orders">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Orders</h2>
                  <p className="text-sm text-muted-foreground">View your order history</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/account/wishlist">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Wishlist</h2>
                  <p className="text-sm text-muted-foreground">Your saved items</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/account/vendor">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Store className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Vendor Dashboard</h2>
                  <p className="text-sm text-muted-foreground">Manage your store and orders</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/marketplace">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Marketplace</h2>
                  <p className="text-sm text-muted-foreground">Browse and shop</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/account/settings">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Settings</h2>
                  <p className="text-sm text-muted-foreground">Account preferences</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </SectionContainer>
  );
}
