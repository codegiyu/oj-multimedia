'use client';

import Link from 'next/link';
import { DashboardPageHeader, DashboardStatCard } from '@/components/layout/user-dashboard';
import { Card } from '@/components/ui/card';
import { Package, Heart, Store, ShoppingBag, Settings, Mic2 } from 'lucide-react';

export function AccountHubQuickLinks() {
  return (
    <div>
      <DashboardPageHeader title="Quick links" description="Jump to a section of your account." />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: '/account/orders', title: 'Orders', desc: 'Track purchases', icon: Package },
          { href: '/account/wishlist', title: 'Wishlist', desc: 'Saved products', icon: Heart },
          {
            href: '/account/favorites',
            title: 'Favorites',
            desc: 'Saved music & videos',
            icon: Heart,
          },
          {
            href: '/account/settings',
            title: 'Settings',
            desc: 'Profile & security',
            icon: Settings,
          },
          {
            href: '/account/artist-portal',
            title: 'Artist portal',
            desc: 'Music & videos',
            icon: Mic2,
          },
          {
            href: '/account/vendor',
            title: 'Vendor dashboard',
            desc: 'Store & orders',
            icon: Store,
          },
          { href: '/marketplace', title: 'Marketplace', desc: 'Shop', icon: ShoppingBag },
        ].map(item => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className="h-full border-border/80 p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/** Stat card only — pairs with cached orders fetch in AccountHubOrdersSection. */
export function AccountHubOrdersStatCard({ total }: { total: number }) {
  return <DashboardStatCard label="Total orders" value={total} icon={Package} />;
}

/** Stat card only — pairs with cached wishlist fetch in AccountHubWishlistSection. */
export function AccountHubWishlistStatCard({ total }: { total: number }) {
  return <DashboardStatCard label="Wishlist" value={total} icon={Heart} />;
}
