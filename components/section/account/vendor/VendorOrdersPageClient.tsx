'use client';

/**
 * Vendor orders list: filter by status, pagination.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { DashboardPageHeader, DashboardStatCard } from '@/components/layout/user-dashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Loader2, Mail } from 'lucide-react';
import { callApi } from '@/lib/services/callApi';
import type { IVendorOrdersRes } from '@/lib/constants/endpoints';
import { formatPrice } from '@/lib/utils/marketplace';
import type { ApiErrorResponse } from '@/lib/types/http';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

function statusBadgeClass(status: string) {
  if (status === 'delivered') return 'bg-primary text-primary-foreground';
  if (status === 'shipped') return 'bg-blue-500/15 text-blue-700 dark:text-blue-400';
  if (status === 'cancelled') return 'bg-destructive/15 text-destructive';
  return 'bg-muted text-muted-foreground';
}

interface VendorOrdersListProps {
  orders: IVendorOrdersRes['orders'];
  statusFilter: string;
  onStatusFilterChange: (value: string | null) => void;
  page: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  loading: boolean;
}

function VendorOrdersList({
  orders,
  statusFilter,
  onStatusFilterChange,
  page,
  totalPages,
  onPreviousPage,
  onNextPage,
  loading,
}: VendorOrdersListProps) {
  const pageStats = useMemo(() => {
    const pending = orders.filter(o =>
      ['pending', 'processing', 'confirmed'].includes(o.status)
    ).length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const completed = orders.filter(o => o.status === 'delivered').length;
    return { pending, shipped, completed, total: orders.length };
  }, [orders]);

  return (
    <div className="relative space-y-8">
      {loading ? (
        <div className="absolute inset-0 z-10 flex items-start justify-center bg-background/60 pt-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        </div>
      ) : null}

      <DashboardPageHeader title="Orders" description="View and manage customer orders" />

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          On this page
        </p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <DashboardStatCard label="Total orders" value={pageStats.total} />
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
              onStatusFilterChange(opt.value || null);
            }}>
            {opt.label}
          </Button>
        ))}
      </div>

      {orders.length === 0 ? (
        <Card className="border-border/80 py-16 text-center shadow-sm">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            No orders match your filter. Try selecting a different status.
          </p>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden border-border/80 p-0 shadow-sm">
            <div className="border-b border-border/60 px-5 py-4">
              <h2 className="text-base font-semibold text-foreground">Recent orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {orders.map(order => {
                    const first = order.items[0];
                    const productLabel =
                      first?.productName ??
                      (typeof first?.product === 'object' && first?.product
                        ? first.product.name
                        : null) ??
                      'Product';
                    const extra = order.items.length > 1 ? ` +${order.items.length - 1}` : '';
                    const qty = order.items.reduce((acc, i) => acc + i.quantity, 0);
                    return (
                      <tr key={order._id} className="bg-card">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {order.orderNumber}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{order.customer.name}</p>
                          <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                        </td>
                        <td className="max-w-[200px] px-4 py-3">
                          <p className="line-clamp-2 font-medium text-foreground">{productLabel}</p>
                          {extra ? (
                            <p className="text-xs text-muted-foreground">{extra} more</p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 tabular-nums">{qty}</td>
                        <td className="px-4 py-3 font-semibold text-primary tabular-nums">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                              statusBadgeClass(order.status)
                            )}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground tabular-nums">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                            aria-label="Email customer"
                            onClick={() => {
                              window.location.href = `mailto:${encodeURIComponent(order.customer.email)}`;
                            }}>
                            <Mail className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

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
                onClick={onPreviousPage}>
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                disabled={page >= totalPages}
                onClick={onNextPage}>
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export interface VendorOrdersPageClientProps {
  initialOrders: IVendorOrdersRes['orders'];
  initialTotalPages: number;
  initialErrorMessage: string | null;
}

export function VendorOrdersPageClient({
  initialOrders,
  initialTotalPages,
  initialErrorMessage,
}: VendorOrdersPageClientProps) {
  const [statusFilter, setStatusFilter] = useQueryState('status', parseAsString.withDefault(''));
  const [orders, setOrders] = useState<IVendorOrdersRes['orders']>(initialOrders);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialErrorMessage);
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize] = useQueryState('pagesize', parseAsInteger.withDefault(10));
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [reloadIndex, setReloadIndex] = useState(0);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    let cancelled = false;

    const loadOrders = async () => {
      setLoading(true);

      const searchParams = new URLSearchParams();
      searchParams.set('page', String(page));
      searchParams.set('limit', String(pageSize));
      if (statusFilter) {
        searchParams.set('status', statusFilter);
      }

      const { data, error, message } = await callApi('VENDOR_GET_ORDERS', {
        query: `?${searchParams.toString()}`,
      });

      if (cancelled) return;

      if (error || !data) {
        setOrders([]);
        setTotalPages(1);

        const responseCode = (error as ApiErrorResponse | undefined)?.responseCode;

        if (responseCode === 403 || responseCode === 404) {
          setErrorMessage(null);
        } else {
          setErrorMessage(message || 'Unable to load orders.');
        }
      } else {
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages || 1);
        setErrorMessage(null);
      }

      setLoading(false);
    };

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, [statusFilter, page, pageSize, reloadIndex]);

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
          <span>{errorMessage}</span>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => setReloadIndex(prev => prev + 1)}>
            Retry
          </Button>
        </div>
      )}
      <VendorOrdersList
        orders={orders}
        statusFilter={statusFilter}
        onStatusFilterChange={value => {
          setStatusFilter(value);
          setPage(1);
        }}
        page={page}
        totalPages={totalPages}
        onPreviousPage={() => setPage(Math.max(1, page - 1))}
        onNextPage={() => setPage(Math.min(totalPages, page + 1))}
        loading={loading}
      />
    </div>
  );
}
