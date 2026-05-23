'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DashboardBanner,
  DashboardPageHeader,
  DashboardStatCard,
} from '@/components/layout/user-dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Package, Heart, Store, ArrowRight, ShoppingBag, Settings, Mic2 } from 'lucide-react';
import type { PopulatedUser } from '@/lib/constants/endpoints';
import type { PopulatedMarketplaceOrder } from '@/lib/constants/endpoints';
import type { IUserWishlistItem } from '@/lib/constants/endpoints';
import { formatPrice } from '@/lib/utils/marketplace';
import { cn } from '@/lib/utils';
import { FillImage } from '@/components/general/FillImage';

export interface AccountPageClientProps {
  user: PopulatedUser | null;
  errorMessage: string | null;
  ordersTotal: number;
  wishlistTotal: number;
  recentOrders: PopulatedMarketplaceOrder[];
  wishlistPreview: IUserWishlistItem[];
}

function orderStatusClass(status: string) {
  if (status === 'delivered') return 'bg-primary text-primary-foreground';
  if (status === 'shipped') return 'bg-blue-500/15 text-blue-700 dark:text-blue-400';
  return 'bg-muted text-muted-foreground';
}

export function AccountPageClient({
  user,
  errorMessage,
  ordersTotal,
  wishlistTotal,
  recentOrders,
  wishlistPreview,
}: AccountPageClientProps) {
  const router = useRouter();
  const firstName = user?.firstName?.trim() || '';

  return (
    <div className="space-y-8">
      <DashboardBanner
        title={firstName ? `Welcome back, ${firstName}!` : 'Welcome back!'}
        description="Here's what's happening with your account."
        className="rounded-2xl">
        <Button
          className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
          asChild>
          <Link href="/account/vendor" className="gap-2">
            <Store className="h-4 w-4" />
            View vendor dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </DashboardBanner>

      {errorMessage && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
          <span>{errorMessage}</span>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => router.refresh()}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard label="Total orders" value={ordersTotal} icon={Package} />
        <DashboardStatCard label="Wishlist" value={wishlistTotal} icon={Heart} />
        <DashboardStatCard
          label="Marketplace"
          value="Shop"
          hint="Browse vendors"
          icon={ShoppingBag}
        />
        <DashboardStatCard label="Portals" value="2" hint="Artist & vendor" icon={Store} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-foreground">Recent orders</h2>
            <Link
              href="/account/orders"
              className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <Card className="gap-0 border-border/80 py-0 shadow-sm">
            <div className="divide-y divide-border/60">
              {recentOrders.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No orders yet.{' '}
                  <Link href="/marketplace" className="font-medium text-primary hover:underline">
                    Browse marketplace
                  </Link>
                </div>
              ) : (
                recentOrders.map(order => {
                  const thumb = order.items[0]?.product?.image;
                  return (
                    <div
                      key={order._id}
                      className="flex items-center gap-3 bg-primary/[0.06] px-4 py-3 first:rounded-t-xl last:rounded-b-xl">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {thumb ? (
                          <FillImage src={thumb} alt="" sizes="48px" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()} · {order.items.length}{' '}
                          item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <span
                          className={cn(
                            'mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                            orderStatusClass(order.status)
                          )}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-foreground">Your wishlist</h2>
            <Link
              href="/account/wishlist"
              className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {wishlistPreview.length === 0 ? (
              <Card className="col-span-full border-border/80 py-10 text-center text-sm text-muted-foreground shadow-sm">
                Your wishlist is empty.{' '}
                <Link href="/marketplace" className="font-medium text-primary hover:underline">
                  Explore products
                </Link>
              </Card>
            ) : (
              wishlistPreview.map(item => {
                const img = item.product.images?.[0];
                return (
                  <Card
                    key={item._id}
                    className="gap-0 overflow-hidden border-border/80 py-0 shadow-sm">
                    <div className="relative aspect-[4/5] bg-muted">
                      {img ? (
                        <FillImage src={img} alt="" sizes="(max-width: 768px) 50vw, 280px" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          <Heart className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 p-3">
                      <p className="line-clamp-2 text-sm font-medium text-foreground">
                        {item.product.name}
                      </p>
                      <p className="text-sm font-bold text-primary">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div>
        <DashboardPageHeader title="Quick links" description="Jump to a section of your account." />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/account/orders', title: 'Orders', desc: 'Track purchases', icon: Package },
            { href: '/account/wishlist', title: 'Wishlist', desc: 'Saved items', icon: Heart },
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
    </div>
  );
}
