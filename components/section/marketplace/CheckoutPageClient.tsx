'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeader } from '@/components/general/SectionHeader';
import { Card } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCartStore, useInitCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { formatPrice } from '@/lib/utils/marketplace';
import { toast } from 'sonner';
import { callApi } from '@/lib/services/callApi';
import type { ICartRes, IMarketplacePlaceOrderRes } from '@/lib/constants/endpoints';
import { EmptyState } from '@/components/section/news/EmptyState';
import { CreditCard, ShoppingCart } from 'lucide-react';

export function CheckoutPageClient() {
  const router = useRouter();
  const { items, actions } = useCartStore();
  const total = actions.getTotal();
  const user = useAuthStore(state => state.user);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    if (!user) return;
    const u = user as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
    };
    const name = [u.firstName, u.lastName].filter(Boolean).join(' ').trim();
    setForm(f => ({
      ...f,
      ...(name ? { name } : {}),
      ...(u.email ? { email: u.email } : {}),
      ...(u.phoneNumber ? { phone: u.phoneNumber } : {}),
    }));
  }, [user]);

  if (items.length === 0) {
    return (
      <MainLayout>
        <SectionContainer className="py-16 md:py-20">
          <EmptyState
            title="Your cart is empty"
            description="Add items from the marketplace before checking out."
            icon={<ShoppingCart className="w-12 h-12 text-muted-foreground" />}
            actionLabel="Browse Marketplace"
            actionHref="/marketplace"
            showDefaultActions={false}
          />
        </SectionContainer>
      </MainLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let checkoutItems = items;

      if (user) {
        const {
          data: cartData,
          error: cartError,
          message: cartMessage,
        } = await callApi('USER_CART_GET', {});
        if (cartError) {
          toast.error(cartMessage ?? 'Could not sync your cart. Please try again.');
          return;
        }
        const cart = cartData as ICartRes | undefined;
        if (cart?.items) {
          actions.syncFromBackend(cart);
          checkoutItems = useInitCartStore.getState().items;
        }
      }

      const payload = {
        customer: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim() || undefined,
          notes: form.notes.trim() || undefined,
        },
        items: checkoutItems.map(item => ({
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
      actions.clearCartAfterOrder();
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
      const placedOrders =
        orderData?.orders && orderData.orders.length > 0
          ? orderData.orders
          : orderData?.order
            ? [orderData.order]
            : [];

      if (user) {
        router.push('/account/orders');
        return;
      }

      const successParams = new URLSearchParams();
      const orderNumbers = placedOrders.map(o => o.orderNumber).filter(Boolean);
      const orderIds = placedOrders.map(o => o._id).filter(Boolean);
      if (orderNumbers.length > 0) {
        successParams.set('orderNumbers', orderNumbers.join(','));
      }
      if (orderIds.length > 0) {
        successParams.set('orderIds', orderIds.join(','));
      }
      const successQuery = successParams.toString();
      router.push(
        successQuery ? `/marketplace/order-success?${successQuery}` : '/marketplace/order-success'
      );
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
          <SectionHeader
            icon={CreditCard}
            heading="Checkout"
            subtext="Enter your details to complete your order"
            className="mb-8"
          />

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
                    <li
                      key={item.sku ? `${item.productId}-${item.sku}` : item.productId}
                      className="flex justify-between text-sm">
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
