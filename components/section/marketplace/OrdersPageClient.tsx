'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils/marketplace';
import { MessageCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { callApi } from '@/lib/services/callApi';
import type { PopulatedMarketplaceOrder } from '@/lib/constants/endpoints';
import { toast } from 'sonner';

export function OrdersPageClient() {
  const [orders, setOrders] = useState<PopulatedMarketplaceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error, message } = await callApi('MARKETPLACE_GET_MY_ORDERS', {});
      if (!mounted) return;
      if (error) {
        setOrders([]);
        setErrorMessage(message || 'Unable to load your orders right now.');
      } else {
        setOrders(data?.orders ?? []);
        setErrorMessage(null);
      }
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <SectionContainer className="py-16 md:py-20">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Package className="w-8 h-8 text-muted-foreground animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Loading your orders</h1>
            <p className="text-muted-foreground">Please wait while we fetch your order history.</p>
          </div>
        </SectionContainer>
      </MainLayout>
    );
  }

  if (errorMessage) {
    return (
      <MainLayout>
        <SectionContainer className="py-16 md:py-20">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <Package className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Could not load orders</h1>
            <p className="text-muted-foreground mb-8">{errorMessage}</p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  window.location.reload();
                }}>
                Retry
              </Button>
              <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
                <Link href="/marketplace">Browse Marketplace</Link>
              </Button>
            </div>
          </div>
        </SectionContainer>
      </MainLayout>
    );
  }

  if (orders.length === 0) {
    return (
      <MainLayout>
        <SectionContainer className="py-16 md:py-20">
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
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>

          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order._id} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="font-mono text-sm text-muted-foreground">{order.orderNumber}</p>
                    <p className="font-semibold text-foreground mt-1">
                      {order.vendor.storeName ?? 'Vendor'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item
                      {order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-primary">{formatPrice(order.totalAmount)}</span>
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        order.status === 'delivered'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                {(order.whatsappLink || order.vendor.whatsapp) && (
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
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
