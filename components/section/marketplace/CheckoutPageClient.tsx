'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils/marketplace';
import Link from 'next/link';
import { toast } from 'sonner';

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
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
              <Link href="/marketplace">Browse Marketplace</Link>
            </Button>
          </div>
        </SectionContainer>
      </MainLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Mock: simulate order placement
      await new Promise(r => setTimeout(r, 800));
      actions.clearCart();
      toast.success('Order placed successfully! We will contact you for payment.');
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
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="mt-2"
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
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6 bg-primary hover:bg-primary/90">
                  {submitting ? 'Placing order…' : 'Place order'}
                </Button>
                <Button type="button" variant="ghost" className="w-full mt-2" asChild>
                  <Link href="/marketplace/cart">Back to cart</Link>
                </Button>
              </Card>
            </div>
          </form>
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
