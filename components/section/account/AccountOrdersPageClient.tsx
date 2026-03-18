'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { callApi } from '@/lib/services/callApi';
import type { PopulatedMarketplaceOrder } from '@/lib/constants/endpoints';
import { formatPrice } from '@/lib/utils/marketplace';
import { toast } from 'sonner';

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

function AccountOrdersLoadingState() {
  return (
    <SectionContainer>
      <div className="max-w-xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Package className="w-8 h-8 text-muted-foreground animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Loading your orders</h1>
        <p className="text-muted-foreground">Please wait while we fetch your order history.</p>
      </div>
    </SectionContainer>
  );
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

  if (loading) {
    return <AccountOrdersLoadingState />;
  }

  if (orders.length === 0 && !errorMessage) {
    return (
      <SectionContainer>
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">No orders yet</h1>
          <p className="text-muted-foreground mb-8">
            Your order history will appear here after you place an order.
          </p>
          <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
            <Link href="/marketplace">Browse Marketplace</Link>
          </Button>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Orders</h1>

        {errorMessage && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4 mb-6">
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

        {orders.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {STATUS_OPTIONS.map(opt => (
                <Button
                  key={opt.value || 'all'}
                  variant={statusFilter === opt.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setStatusFilter(opt.value || null);
                    setPage(1);
                  }}
                  className={statusFilter === opt.value ? 'bg-primary hover:bg-primary/90' : ''}>
                  {opt.label}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order._id} className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-mono text-sm text-muted-foreground">{order.orderNumber}</p>
                      <p className="font-semibold text-foreground mt-1">
                        {order.vendor?.name ?? order.vendor?.storeName ?? 'Vendor'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item
                        {order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-primary">
                        {formatPrice(order.totalAmount)}
                      </span>
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-primary/10 text-primary'
                            : order.status === 'cancelled'
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-muted text-muted-foreground'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  {(order.whatsappLink || order.vendor?.whatsapp) && (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground">
                        Need to follow up? Chat with the vendor about this order.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
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
                            toast.error(
                              message || 'Unable to generate WhatsApp link for this order.'
                            );
                            return;
                          }

                          if (data.whatsappLink) {
                            window.open(data.whatsappLink, '_blank');
                          } else {
                            toast.error(
                              'This vendor does not have a WhatsApp number configured for chat.'
                            );
                          }
                        }}>
                        <MessageCircle className="w-4 h-4" />
                        Chat on WhatsApp
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage(Math.max(1, page - 1))}>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
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
          <div className="flex justify-center mt-6">
            <Button asChild variant="outline" size="sm">
              <Link href="/marketplace">Browse Marketplace</Link>
            </Button>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
