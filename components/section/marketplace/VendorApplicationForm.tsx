'use client';

import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { toast } from 'sonner';
import { callApi } from '@/lib/services/callApi';
import { useForm } from '@/lib/hooks/use-form';
import { cn } from '@/lib/utils';
import type { ApiErrorResponse } from '@/lib/types/http';

const vendorApplicationSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  storeDescription: z.string().optional(),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string().min(1, 'Phone is required'),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
});

type VendorApplicationValues = z.infer<typeof vendorApplicationSchema>;

export interface VendorApplicationFormProps {
  /** Called after successful API submission (e.g. close modal + refresh) */
  onSuccess?: () => void;
  /** Omit outer Card wrapper (e.g. when used inside a dialog) */
  bare?: boolean;
  className?: string;
}

export function VendorApplicationForm({ onSuccess, bare, className }: VendorApplicationFormProps) {
  const { formValues, formErrors, loading, handleInputChange, handleSubmit, errorsVisible } =
    useForm<typeof vendorApplicationSchema>({
      formSchema: vendorApplicationSchema,
      defaultFormValues: {
        storeName: '',
        storeDescription: '',
        email: '',
        phone: '',
        whatsapp: '',
        address: '',
        bankAccountName: '',
        bankAccountNumber: '',
        bankName: '',
      },
      async onSubmit(values: VendorApplicationValues) {
        const payload = {
          storeName: values.storeName.trim(),
          storeDescription: values.storeDescription?.trim() || undefined,
          email: values.email.trim(),
          phone: values.phone.trim(),
          whatsapp: values.whatsapp?.trim() || undefined,
          address: values.address?.trim() || undefined,
          bankAccountName: values.bankAccountName?.trim() || undefined,
          bankAccountNumber: values.bankAccountNumber?.trim() || undefined,
          bankName: values.bankName?.trim() || undefined,
        };

        const { error, message } = await callApi('MARKETPLACE_BECOME_VENDOR', { payload });

        if (error) {
          const code = (error as ApiErrorResponse | undefined)?.responseCode;
          if (code === 409) {
            toast.error(message || 'You already have a vendor application linked to your account.');
            return false;
          }
          toast.error(message ?? 'Failed to submit application. Please check your details.');
          return false;
        }

        toast.success('Application received! We will review and get back to you soon.');
        onSuccess?.();
        return true;
      },
    });

  const formInner = (
    <form onSubmit={handleSubmit} className={cn('space-y-8 pt-2', className)}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Store details</h2>
        <div className="space-y-4">
          <RegularInput
            label="Store name"
            name="storeName"
            required
            value={formValues.storeName}
            onChange={handleInputChange}
            placeholder="Enter store name"
            disabled={loading}
            errors={errorsVisible ? (formErrors.storeName ?? []) : []}
          />
          <RegularTextarea
            label="Store description (optional)"
            name="storeDescription"
            value={formValues.storeDescription ?? ''}
            onChange={handleInputChange}
            rows={3}
            placeholder="Tell customers about your store"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Contact</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <RegularInput
            label="Email"
            name="email"
            type="email"
            required
            value={formValues.email}
            onChange={handleInputChange}
            placeholder="Enter email"
            disabled={loading}
            errors={errorsVisible ? (formErrors.email ?? []) : []}
          />
          <RegularInput
            label="Phone"
            name="phone"
            type="tel"
            required
            value={formValues.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            disabled={loading}
            errors={errorsVisible ? (formErrors.phone ?? []) : []}
          />
          <RegularInput
            label="WhatsApp (optional)"
            name="whatsapp"
            type="tel"
            value={formValues.whatsapp ?? ''}
            onChange={handleInputChange}
            placeholder="Enter WhatsApp number"
            disabled={loading}
            wrapClassName="md:col-span-2"
          />
          <RegularTextarea
            label="Address (optional)"
            name="address"
            value={formValues.address ?? ''}
            onChange={handleInputChange}
            rows={2}
            placeholder="Business address"
            disabled={loading}
            wrapClassName="md:col-span-2"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Bank details</h2>
        <p className="text-sm text-muted-foreground">
          For receiving payments. You can update this later in vendor settings.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <RegularInput
            label="Account name"
            name="bankAccountName"
            value={formValues.bankAccountName ?? ''}
            onChange={handleInputChange}
            placeholder="Bank account name"
            disabled={loading}
          />
          <RegularInput
            label="Account number"
            name="bankAccountNumber"
            value={formValues.bankAccountNumber ?? ''}
            onChange={handleInputChange}
            placeholder="Bank account number"
            disabled={loading}
          />
          <RegularInput
            label="Bank name"
            name="bankName"
            value={formValues.bankName ?? ''}
            onChange={handleInputChange}
            placeholder="Bank name"
            disabled={loading}
            wrapClassName="md:col-span-2"
          />
        </div>
      </div>

      <RegularBtn
        type="submit"
        variant="default"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={loading}
        loading={loading}
        onDisabledClick={() => {
          if (loading) toast.info('Please wait, submitting your application…');
        }}>
        {loading ? 'Submitting…' : 'Submit application'}
      </RegularBtn>
    </form>
  );

  if (bare) {
    return formInner;
  }

  return <Card className="p-6 md:p-8">{formInner}</Card>;
}
