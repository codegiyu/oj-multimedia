'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { DashboardPageHeader, DashboardStatCard } from '@/components/layout/user-dashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { callApi } from '@/lib/services/callApi';
import type { PopulatedMarketplaceOrder } from '@/lib/constants/endpoints';
import { formatPrice } from '@/lib/utils/marketplace';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { FillImage } from '@/components/general/FillImage';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export interface AccountOrdersPageClientProps {
  initialOrders: PopulatedMarketplaceOrder[];
  initialTotalPages: number;
  initialErrorMessage: string | null;
}

function orderStatusBadgeClass(status: string) {
  if (status === 'delivered') return 'bg-primary text-primary-foreground';
  if (status === 'shipped') return 'bg-blue-500/15 text-blue-700 dark:text-blue-400';
  if (status === 'cancelled') return 'bg-destructive/15 text-destructive';
  return 'bg-muted text-muted-foreground';
}

export function AccountOrdersPageClient({
  initialOrders,
  initialTotalPages,
  initialErrorMessage,
}: AccountOrdersPageClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<PopulatedMarketplaceOrder[]>(initialOrders);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialErrorMessage);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(10));
  const [statusFilter, setStatusFilter] = useQueryState('status', parseAsString.withDefault(''));
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    let cancelled = false;

    const loadOrders = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(pageSize));
      if (statusFilter) params.set('status', statusFilter);
      const query = `?${params.toString()}` as const;

      const { data, error, message } = await callApi('MARKETPLACE_GET_MY_ORDERS', { query });

      if (cancelled) return;

      if (error || !data) {
        setOrders([]);
        setTotalPages(1);
        setErrorMessage(message || 'Unable to load orders.');
      } else {
        setOrders(data.orders);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setErrorMessage(null);
      }
      setLoading(false);
    };

    void loadOrders();
    return () => {
      cancelled = true;
    };
  }, [page, pageSize, statusFilter]);

  const pageStats = useMemo(() => {
    const pending = orders.filter(o =>
      ['pending', 'processing', 'confirmed'].includes(o.status)
    ).length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const completed = orders.filter(o => o.status === 'delivered').length;
    return { pending, shipped, completed, total: orders.length };
  }, [orders]);

  if (orders.length === 0 && !errorMessage) {
    return (
      <div className="space-y-8">
        <DashboardPageHeader title="My orders" description="Track and manage your purchases" />
        <div className="mx-auto max-w-md rounded-2xl border border-border/80 bg-card px-6 py-12 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">No orders yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your order history will appear here after you place an order.
          </p>
          <Button asChild className="mt-8 rounded-full bg-primary hover:bg-primary/90">
            <Link href="/marketplace">Browse marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-8">
      {loading ? (
        <div className="absolute inset-0 z-10 flex items-start justify-center bg-background/60 pt-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        </div>
      ) : null}

      <DashboardPageHeader title="My orders" description="Track and manage your purchases" />

      {errorMessage && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
          <span>{errorMessage}</span>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive/10 shrink-0"
            onClick={() => router.refresh()}>
            Retry
          </Button>
        </div>
      )}

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          On this page
        </p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <DashboardStatCard label="Total" value={pageStats.total} />
          <DashboardStatCard
            label="Pending"
            value={pageStats.pending}
            valueClassName="text-amber-600 dark:text-amber-400"
          />
          <DashboardStatCard
            label="Shipped"
            value={pageStats.shipped}
            valueClassName="text-blue-600 dark:text-blue-400"
          />
          <DashboardStatCard
            label="Completed"
            value={pageStats.completed}
            valueClassName="text-primary"
          />
        </div>
      </div>

      {orders.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map(opt => (
              <Button
                key={opt.value || 'all'}
                variant={statusFilter === opt.value ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'rounded-full',
                  statusFilter === opt.value && 'bg-primary hover:bg-primary/90'
                )}
                onClick={() => {
                  setStatusFilter(opt.value || null);
                  setPage(1);
                }}>
                {opt.label}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {orders.map(order => (
              <Card
                key={order._id}
                className="gap-0 overflow-hidden border-border/80 p-0 shadow-sm">
                <div className="flex flex-col gap-4 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{order.orderNumber}</p>
                    <p className="mt-1 font-semibold text-foreground">
                      {order.vendor?.name ?? order.vendor?.storeName ?? 'Vendor'}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item
                      {order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium capitalize',
                        orderStatusBadgeClass(order.status)
                      )}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 bg-primary/[0.05] p-4">
                  {order.items.map((line, idx) => (
                    <div
                      key={`${order._id}-${idx}`}
                      className="flex items-center gap-3 rounded-2xl bg-background/80 px-3 py-2">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <FillImage
                          src={line.product.image ?? ''}
                          alt=""
                          imageContext="dashboard"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground">{line.product.name}</p>
                        <p className="text-sm font-semibold text-primary">
                          {formatPrice(line.totalPrice ?? line.price * line.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3 border-t border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total amount</p>
                    <p className="text-lg font-bold text-foreground">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-primary text-primary"
                      asChild>
                      <Link href={`/marketplace/vendors/${order.vendor?.slug ?? ''}`}>
                        View vendor
                      </Link>
                    </Button>
                    {(order.whatsappLink || order.vendor?.whatsapp) && (
                      <Button
                        variant="default"
                        size="sm"
                        className="rounded-full bg-primary hover:bg-primary/90"
                        onClick={async () => {
                          if (order.whatsappLink) {
                            window.open(order.whatsappLink, '_blank');
                            return;
                          }
                          const { data, error, message } = await callApi(
                            'MARKETPLACE_ORDER_WHATSAPP_LINK',
                            { query: `/${order._id}/whatsapp-link` as `/${string}` }
                          );
                          if (error || !data) {
                            toast.error(message || 'Unable to open WhatsApp for this order.');
                            return;
                          }
                          if (data.whatsappLink) window.open(data.whatsappLink, '_blank');
                          else toast.error('Vendor has no WhatsApp configured.');
                        }}>
                        <MessageCircle className="mr-1 h-4 w-4" />
                        WhatsApp
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  disabled={page <= 1}
                  onClick={() => setPage(Math.max(1, page - 1))}>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  disabled={page >= totalPages}
                  onClick={() => setPage(Math.min(totalPages, page + 1))}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {orders.length === 0 && errorMessage && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <Link href="/marketplace">Browse marketplace</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
