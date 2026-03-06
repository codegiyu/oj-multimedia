'use client';

import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMockOrders, formatPrice } from '@/lib/utils/marketplace';
import { Package } from 'lucide-react';
import Link from 'next/link';

export function AccountOrdersPageClient() {
  const orders = getMockOrders();

  if (orders.length === 0) {
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
        <h1 className="text-3xl font-bold text-foreground mb-8">Orders</h1>
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order._id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-mono text-sm text-muted-foreground">{order.orderNumber}</p>
                  <p className="font-semibold text-foreground mt-1">
                    {order.vendorName ?? 'Vendor'}
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
            </Card>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
