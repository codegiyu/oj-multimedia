'use client';

import { useState } from 'react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';

export function VendorSettingsPageClient() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    storeName: 'Grace Fashion Co',
    storeDescription: 'Modest and stylish apparel for the whole family.',
    email: 'vendor@example.com',
    phone: '+2348012345678',
    whatsapp: '+2348012345678',
    address: 'Lagos, Nigeria',
    bankAccountName: 'Grace Fashion Co',
    bankAccountNumber: '0123456789',
    bankName: 'Example Bank',
    logoUrl: '/images/album-1.jpg',
    coverImageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      toast.success('Settings saved.');
    } catch {
      toast.error('Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionContainer>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8 flex items-center gap-2">
          <Settings className="w-8 h-8 text-primary" />
          Vendor Settings
        </h1>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Store profile</h2>
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
                <div>
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={form.logoUrl}
                    onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="coverImageUrl">Cover image URL (optional)</Label>
                  <Input
                    id="coverImageUrl"
                    value={form.coverImageUrl}
                    onChange={e => setForm(f => ({ ...f, coverImageUrl: e.target.value }))}
                    className="mt-2"
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
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={form.whatsapp}
                    onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
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
              <h2 className="text-lg font-semibold text-foreground mb-4">Bank account</h2>
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

            <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90">
              {submitting ? 'Saving…' : 'Save settings'}
            </Button>
          </form>
        </Card>
      </div>
    </SectionContainer>
  );
}
