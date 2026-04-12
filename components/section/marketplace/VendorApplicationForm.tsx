'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { callApi } from '@/lib/services/callApi';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface VendorApplicationFormProps {
  /** Called after successful API submission (e.g. close modal + refresh) */
  onSuccess?: () => void;
  /** Omit outer Card wrapper (e.g. when used inside a dialog) */
  bare?: boolean;
  className?: string;
}

export function VendorApplicationForm({ onSuccess, bare, className }: VendorApplicationFormProps) {
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
      const payload = {
        storeName: form.storeName.trim(),
        storeDescription: form.storeDescription.trim() || undefined,
        email: form.email.trim(),
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim() || undefined,
        address: form.address.trim() || undefined,
        bankAccountName: form.bankAccountName.trim() || undefined,
        bankAccountNumber: form.bankAccountNumber.trim() || undefined,
        bankName: form.bankName.trim() || undefined,
      };

      const { error, message } = await callApi('MARKETPLACE_BECOME_VENDOR', {
        payload,
      });

      if (error) {
        toast.error(message ?? 'Failed to submit application. Please check your details.');
        return;
      }

      toast.success('Application received! We will review and get back to you soon.');
      onSuccess?.();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formInner = (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Store details</h2>
        <div className="space-y-4">
          <RegularInput
            label="Store name"
            name="storeName"
            required
            value={form.storeName}
            onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))}
            placeholder="Enter store name"
          />
          <div className="space-y-2">
            <Label htmlFor="vendor-app-store-desc">Store description (optional)</Label>
            <Textarea
              id="vendor-app-store-desc"
              value={form.storeDescription}
              onChange={e => setForm(f => ({ ...f, storeDescription: e.target.value }))}
              className="mt-0"
              rows={3}
              placeholder="Tell customers about your store"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Contact</h2>
        <div className="space-y-4">
          <RegularInput
            label="Email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="Enter email"
          />
          <RegularInput
            label="Phone"
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            placeholder="Enter phone number"
          />
          <RegularInput
            label="WhatsApp (optional)"
            name="whatsapp"
            type="tel"
            value={form.whatsapp}
            onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
            placeholder="Enter WhatsApp number"
          />
          <div className="space-y-2">
            <Label htmlFor="vendor-app-address">Address (optional)</Label>
            <Textarea
              id="vendor-app-address"
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              rows={2}
              placeholder="Business address"
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
          <RegularInput
            label="Account name"
            name="bankAccountName"
            value={form.bankAccountName}
            onChange={e => setForm(f => ({ ...f, bankAccountName: e.target.value }))}
            placeholder="Bank account name"
          />
          <RegularInput
            label="Account number"
            name="bankAccountNumber"
            value={form.bankAccountNumber}
            onChange={e => setForm(f => ({ ...f, bankAccountNumber: e.target.value }))}
            placeholder="Bank account number"
          />
          <RegularInput
            label="Bank name"
            name="bankName"
            value={form.bankName}
            onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))}
            placeholder="Bank name"
          />
        </div>
      </div>

      <RegularBtn
        type="submit"
        variant="default"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={submitting}
        loading={submitting}
        onDisabledClick={() => {
          if (submitting) toast.info('Please wait, submitting your application…');
        }}>
        {submitting ? 'Submitting…' : 'Submit application'}
      </RegularBtn>
    </form>
  );

  if (bare) {
    return formInner;
  }

  return <Card className="p-6 md:p-8">{formInner}</Card>;
}
