'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { SectionHeader } from '@/components/general/SectionHeader';
import { Card } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { useCartStore, useInitCartStore } from '@/lib/store/cartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { formatPrice } from '@/lib/utils/marketplace';
import { toast } from 'sonner';
import { callApi } from '@/lib/services/callApi';
import type { ICartRes, IMarketplacePlaceOrderRes } from '@/lib/constants/endpoints';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { CreditCard, ShoppingCart } from 'lucide-react';
import { useForm } from '@/lib/hooks/use-form';
import { checkoutSchema, type CheckoutFormValues } from '@/lib/schemas/checkoutSchema';

export function CheckoutPageClient() {
  const router = useRouter();
  const { items, actions } = useCartStore();
  const total = actions.getTotal();
  const user = useAuthStore(state => state.user);

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading: submitting,
    handleInputChange,
    handleSubmit,
    isValid,
    validateForm,
    setFormValues,
  } = useForm<typeof checkoutSchema>({
    formSchema: checkoutSchema,
    defaultFormValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    },
    onSubmit: async (values: CheckoutFormValues) => {
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
            return false;
          }
          const cart = cartData as ICartRes | undefined;
          if (cart?.items) {
            actions.syncFromBackend(cart);
            checkoutItems = useInitCartStore.getState().items;
          }
        }

        const trimmedNotes = values.notes?.trim();
        const payload = {
          customer: {
            name: values.name.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
            address: values.address.trim(),
          },
          ...(trimmedNotes ? { notes: trimmedNotes } : {}),
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
          return false;
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
          return true;
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

        return true;
      } catch {
        toast.error('Something went wrong. Please try again.');
        return false;
      }
    },
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
    setFormValues(f => ({
      ...f,
      ...(name ? { name } : {}),
      ...(u.email ? { email: u.email } : {}),
      ...(u.phoneNumber ? { phone: u.phoneNumber } : {}),
    }));
  }, [user, setFormValues]);

  if (items.length === 0) {
    return (
      <MainLayout>
        <SectionContainer className="marketplace-page-top">
          <SectionEmptyState
            title="Your cart is empty"
            description="Add items from the marketplace before checking out."
            icon={ShoppingCart}
            actionLabel="Browse Marketplace"
            actionHref="/marketplace"
          />
        </SectionContainer>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SectionContainer className="marketplace-page-top">
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
                <RegularInput
                  id="name"
                  name="name"
                  label="Full name"
                  required
                  value={formValues.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  errors={errorsVisible ? formErrors.name : []}
                />
                <RegularInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  required
                  value={formValues.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  errors={errorsVisible ? formErrors.email : []}
                />
                <RegularInput
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone"
                  required
                  value={formValues.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  errors={errorsVisible ? formErrors.phone : []}
                />
                <RegularTextarea
                  id="address"
                  name="address"
                  label="Delivery address"
                  required
                  rows={3}
                  value={formValues.address}
                  onChange={handleInputChange}
                  placeholder="Street, city, and any delivery instructions"
                  errors={errorsVisible ? formErrors.address : []}
                />
                <RegularTextarea
                  id="notes"
                  name="notes"
                  label="Notes (optional)"
                  rows={2}
                  value={formValues.notes ?? ''}
                  onChange={handleInputChange}
                  placeholder="Any extra details for the vendor"
                  errors={errorsVisible ? formErrors.notes : []}
                />
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
                <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground space-y-2">
                  <p className="font-medium text-foreground">
                    What happens when you place your order
                  </p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>
                      Your order is created with status &quot;Pending&quot; (payment offline).
                    </li>
                    <li>
                      If items are from multiple vendors, separate orders are created per vendor.
                    </li>
                    <li>WhatsApp may open so you can notify the vendor(s) immediately.</li>
                    <li>The vendor will contact you to arrange payment (bank transfer, etc.).</li>
                    <li>
                      You&apos;ll be redirected to your orders (signed in) or an order confirmation
                      page (guest).
                    </li>
                  </ol>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Payment will be arranged with the vendor after you place the order (e.g. bank
                  transfer, WhatsApp).
                </p>
                <RegularBtn
                  type="submit"
                  variant="default"
                  className="w-full mt-6 bg-primary hover:bg-primary/90"
                  disabled={submitting || !isValid}
                  loading={submitting}
                  text={submitting ? 'Placing order…' : 'Place order'}
                  onDisabledClick={() => {
                    if (!isValid) {
                      validateForm();
                    } else if (submitting) {
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
