'use client';

import { useState } from 'react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMockOrdersByVendorId, formatPrice } from '@/lib/utils/marketplace';
import { ShoppingBag } from 'lucide-react';

const CURRENT_VENDOR_ID = 'v1';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function VendorOrdersPageClient() {
  const [statusFilter, setStatusFilter] = useState('');
  const allOrders = getMockOrdersByVendorId(CURRENT_VENDOR_ID);
  const orders = statusFilter ? allOrders.filter(o => o.status === statusFilter) : allOrders;

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
              onClick={() => setStatusFilter(opt.value)}
              className={statusFilter === opt.value ? 'bg-primary hover:bg-primary/90' : ''}>
              {opt.label}
            </Button>
          ))}
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No orders match your filter.</p>
          </Card>
        ) : (
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
                    <span className="font-bold text-primary">{formatPrice(order.totalAmount)}</span>
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
        )}
      </div>
    </SectionContainer>
  );
}
