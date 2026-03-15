'use client';

/**
 * Vendor orders list: filter by status, pagination.
 * Not yet implemented: order detail view, status update actions (e.g. Mark as shipped, Confirm).
 * These would require backend support (e.g. VENDOR_GET_ORDER, VENDOR_UPDATE_ORDER).
 */

import { useEffect, useRef, useState } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { callApi } from '@/lib/services/callApi';
import type { IVendorOrdersRes } from '@/lib/constants/endpoints';
import { formatPrice } from '@/lib/utils/marketplace';
import type { ApiErrorResponse } from '@/lib/types/http';
import { VendorCreateStoreState } from './VendorCreateStoreState';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

interface VendorOrdersListProps {
  orders: IVendorOrdersRes['orders'];
  statusFilter: string;
  onStatusFilterChange: (value: string | null) => void;
  page: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

function VendorOrdersLoadingState() {
  return (
    <SectionContainer>
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8 text-muted-foreground animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Loading vendor orders</h1>
        <p className="text-sm text-muted-foreground">
          Please wait while we fetch your recent orders.
        </p>
      </div>
    </SectionContainer>
  );
}

function VendorOrdersList({
  orders,
  statusFilter,
  onStatusFilterChange,
  page,
  totalPages,
  onPreviousPage,
  onNextPage,
}: VendorOrdersListProps) {
  return (
    <SectionContainer>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Vendor Orders</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_OPTIONS.map(opt => (
            <Button
              key={opt.value || 'all'}
              variant={statusFilter === opt.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                onStatusFilterChange(opt.value || null);
              }}
              className={statusFilter === opt.value ? 'bg-primary hover:bg-primary/90' : ''}>
              {opt.label}
            </Button>
          ))}
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No orders match your filter. Try selecting a different status.
            </p>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order._id} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-mono text-sm text-muted-foreground">{order.orderNumber}</p>
                      <p className="font-semibold text-foreground mt-1">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.email}</p>
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
                      <span className="text-sm text-muted-foreground">{order.paymentStatus}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-foreground mb-2">Items</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.productName ?? 'Product'} × {item.quantity} —{' '}
                          {formatPrice(item.price * item.quantity)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={onPreviousPage}>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={onNextPage}>
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </SectionContainer>
  );
}

export interface VendorOrdersPageClientProps {
  initialOrders: IVendorOrdersRes['orders'];
  initialTotalPages: number;
  initialHasVendorProfile: boolean;
  initialErrorMessage: string | null;
}

export function VendorOrdersPageClient({
  initialOrders,
  initialTotalPages,
  initialHasVendorProfile,
  initialErrorMessage,
}: VendorOrdersPageClientProps) {
  const [statusFilter, setStatusFilter] = useQueryState('status', parseAsString.withDefault(''));
  const [orders, setOrders] = useState<IVendorOrdersRes['orders']>(initialOrders);
  const [loading, setLoading] = useState(false);
  const [hasVendorProfile, setHasVendorProfile] = useState<boolean | null>(initialHasVendorProfile);
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
          setHasVendorProfile(false);
          setErrorMessage(null);
        } else {
          setHasVendorProfile(true);
          setErrorMessage(message || 'Unable to load orders.');
        }
      } else {
        setHasVendorProfile(true);
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

  if (loading) {
    return <VendorOrdersLoadingState />;
  }

  if (hasVendorProfile === false) {
    return (
      <VendorCreateStoreState description="You need a vendor store before you can receive orders. Become a vendor to start selling on the marketplace." />
    );
  }

  return (
    <>
      {errorMessage && (
        <SectionContainer>
          <div className="max-w-3xl mx-auto mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
            <span>{errorMessage}</span>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => setReloadIndex(prev => prev + 1)}>
              Retry
            </Button>
          </div>
        </SectionContainer>
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
      />
    </>
  );
}
