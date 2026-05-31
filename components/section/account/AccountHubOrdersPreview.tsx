'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import type { PopulatedMarketplaceOrder } from '@/lib/constants/endpoints';
import { formatPrice } from '@/lib/utils/marketplace';
import { cn } from '@/lib/utils';
import { FillImage } from '@/components/general/FillImage';

interface AccountHubOrdersPreviewProps {
  recentOrders: PopulatedMarketplaceOrder[];
}

function orderStatusClass(status: string) {
  if (status === 'delivered') return 'bg-primary text-primary-foreground';
  if (status === 'shipped') return 'bg-blue-500/15 text-blue-700 dark:text-blue-400';
  return 'bg-muted text-muted-foreground';
}

export function AccountHubOrdersPreview({ recentOrders }: AccountHubOrdersPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-foreground">Recent orders</h2>
        <Link href="/account/orders" className="text-sm font-medium text-primary hover:underline">
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
                    <FillImage src={thumb ?? ''} alt="" imageContext="dashboard" sizes="48px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item
                      {order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{formatPrice(order.totalAmount)}</p>
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
  );
}
