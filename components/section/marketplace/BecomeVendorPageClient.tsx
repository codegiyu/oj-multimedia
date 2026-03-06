'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function BecomeVendorPageClient() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    storeName: '',
    storeDescription: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      setSubmitted(true);
      toast.success('Application received! We will review and get back to you soon.');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <MainLayout>
        <SectionContainer className="py-16 md:py-20">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Application received</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for applying to become a vendor. We will review your details and contact you
              shortly.
            </p>
            <Button asChild variant="outline">
              <a href="/marketplace">Back to Marketplace</a>
            </Button>
          </div>
        </SectionContainer>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SectionContainer className="py-16 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
              <UserPlus className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Become a Vendor</h1>
            <p className="text-muted-foreground">
              Register to sell on our marketplace. Fill in your store and contact details below.
            </p>
          </div>

          <Card className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Store details</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="storeName">Store name</Label>
                    <Input
                      id="storeName"
                      required
                      value={form.storeName}
                      onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="storeDescription">Store description</Label>
                    <Textarea
                      id="storeDescription"
                      value={form.storeDescription}
                      onChange={e => setForm(f => ({ ...f, storeDescription: e.target.value }))}
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Contact</h2>
                <div className="space-y-4">
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
                    <Label htmlFor="whatsapp">WhatsApp (optional)</Label>
                    <Input
                      id="whatsapp"
                      type="tel"
                      value={form.whatsapp}
                      onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address (optional)</Label>
                    <Textarea
                      id="address"
                      value={form.address}
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      className="mt-2"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Bank details</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  For receiving payments. You can update this later in vendor settings.
                </p>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bankAccountName">Account name</Label>
                    <Input
                      id="bankAccountName"
                      value={form.bankAccountName}
                      onChange={e => setForm(f => ({ ...f, bankAccountName: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankAccountNumber">Account number</Label>
                    <Input
                      id="bankAccountNumber"
                      value={form.bankAccountNumber}
                      onChange={e => setForm(f => ({ ...f, bankAccountNumber: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankName">Bank name</Label>
                    <Input
                      id="bankName"
                      value={form.bankName}
                      onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary/90">
                {submitting ? 'Submitting…' : 'Submit application'}
              </Button>
            </form>
          </Card>
        </div>
      </SectionContainer>
    </MainLayout>
  );
}
