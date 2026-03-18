'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils/marketplace';
import { toast } from 'sonner';
import { callApi } from '@/lib/services/callApi';
import type { IMarketplacePlaceOrderRes } from '@/lib/constants/endpoints';

export function CheckoutPageClient() {
  const router = useRouter();
  const { items, actions } = useCartStore();
  const total = actions.getTotal();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  if (items.length === 0) {
    return (
      <MainLayout>
        <SectionContainer className="py-16 md:py-20">
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h1>
            <RegularBtn
              variant="default"
              className="bg-primary hover:bg-primary/90"
              linkProps={{ href: '/marketplace' }}
              text="Browse Marketplace"
            />
          </div>
        </SectionContainer>
      </MainLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim() || undefined,
        },
        items: items.map(item => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          ...(item.sku ? { sku: item.sku } : {}),
        })),
      };
      const { data, error, message } = await callApi('MARKETPLACE_PLACE_ORDER', { payload });
      if (error) {
        toast.error(message ?? 'Failed to place order. Please try again.');
        return;
      }
      actions.clearCart();
      const orderData = data as IMarketplacePlaceOrderRes | undefined;

      const links: string[] = [];

      if (orderData?.orders && orderData.orders.length > 0) {
        for (const order of orderData.orders) {
          if (order.whatsappLink) {
            links.push(order.whatsappLink);
          }
        }
      } else if (orderData?.order) {
        if (orderData.order.whatsappLink) {
          links.push(orderData.order.whatsappLink);
        } else if (orderData.whatsappLink) {
          links.push(orderData.whatsappLink);
        }
      } else if (orderData?.whatsappLink) {
        links.push(orderData.whatsappLink);
      }

      if (links.length > 0) {
        toast.success(
          links.length === 1
            ? 'Order placed! Opening WhatsApp to notify the vendor.'
            : 'Order placed! Opening WhatsApp chats for your vendors.'
        );
        links.forEach(link => {
          window.open(link, '_blank');
        });
      } else {
        toast.success('Order placed successfully! We will contact you for payment.');
      }
      router.push('/marketplace/orders');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-6">Contact & delivery</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <RegularInput
                    id="name"
                    name="name"
                    label=""
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Enter your full name"
                    wrapClassName="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <RegularInput
                    id="email"
                    name="email"
                    type="email"
                    label=""
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="Enter your email"
                    wrapClassName="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <RegularInput
                    id="phone"
                    name="phone"
                    type="tel"
                    label=""
                    required
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                    wrapClassName="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Delivery address</Label>
                  <Textarea
                    id="address"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    className="mt-2"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="mt-2"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div>
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Order summary</h2>
                <ul className="space-y-2 mb-6">
                  {items.map(item => (
                    <li key={item.productId} className="flex justify-between text-sm">
                      <span className="text-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-primary font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Payment will be arranged with the vendor after you place the order (e.g. bank
                  transfer, WhatsApp).
                </p>
                <RegularBtn
                  type="submit"
                  variant="default"
                  className="w-full mt-6 bg-primary hover:bg-primary/90"
                  disabled={submitting}
                  loading={submitting}
                  text={submitting ? 'Placing order…' : 'Place order'}
                  onDisabledClick={() => {
                    if (submitting) {
                      toast.info('Please wait, placing your order…');
                    }
                  }}
                />
                <RegularBtn
                  type="button"
                  variant="ghost"
                  className="w-full mt-2"
                  linkProps={{ href: '/marketplace/cart' }}
                  text="Back to cart"
                />
              </Card>
            </div>
          </form>
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
