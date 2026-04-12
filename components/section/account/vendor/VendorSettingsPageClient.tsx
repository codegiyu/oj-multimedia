'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import {
  DashboardFormCard,
  DashboardPageHeader,
  DashboardSwitch,
} from '@/components/layout/user-dashboard';
import { Button } from '@/components/ui/button';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { Store, Landmark, Phone, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from '@/lib/hooks/use-form';
import { callApi } from '@/lib/services/callApi';
import { ImageUploadField } from '@/components/general/MediaUploadField';
import type { IVendorMeRes, IVendorUpdateSettingsPayload } from '@/lib/constants/endpoints';

const optionalStoredImageUrl = z
  .string()
  .optional()
  .refine(v => v == null || v === '' || /^https?:\/\/.+/i.test(v), 'Must be a valid image URL');

const vendorSettingsSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  storeDescription: z.string().optional(),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(1, 'Phone is required'),
  whatsapp: z.string().min(1, 'WhatsApp number is required'),
  address: z.string().optional(),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
  logoUrl: optionalStoredImageUrl,
  coverImageUrl: optionalStoredImageUrl,
});

type VendorSettingsValues = z.infer<typeof vendorSettingsSchema>;

function getSettingsValidationMessages(
  values: VendorSettingsValues,
  errors: Partial<Record<keyof VendorSettingsValues | 'root', string[] | undefined>>
): string[] {
  const messages: string[] = [];
  if (!values.storeName?.trim()) messages.push('Store name is required');
  if (!values.email?.trim()) messages.push('Please enter a valid email');
  if (!values.phone?.trim()) messages.push('Phone is required');
  if (!values.whatsapp?.trim()) messages.push('WhatsApp number is required');
  (
    [
      'storeName',
      'storeDescription',
      'email',
      'phone',
      'whatsapp',
      'address',
      'bankAccountName',
      'bankAccountNumber',
      'bankName',
      'logoUrl',
      'coverImageUrl',
    ] as const
  ).forEach(key => {
    const arr = errors[key];
    if (Array.isArray(arr)) arr.forEach(m => messages.push(m));
  });
  return [...new Set(messages)];
}

export interface VendorSettingsPageClientProps {
  initialVendor: IVendorMeRes | null;
  initialLoadError?: string | null;
}

export function VendorSettingsPageClient({
  initialVendor,
  initialLoadError = null,
}: VendorSettingsPageClientProps) {
  const router = useRouter();
  const [initialLoading] = useState(false);
  const [dismissedLoadError, setDismissedLoadError] = useState(false);
  const [storeVisible, setStoreVisible] = useState(true);
  const [vacationMode, setVacationMode] = useState(false);

  const initialFormValues: VendorSettingsValues = {
    storeName: initialVendor?.storeName ?? '',
    storeDescription: initialVendor?.storeDescription ?? '',
    email: ((initialVendor as unknown as { email?: string })?.email ?? '') as string,
    phone: ((initialVendor as unknown as { phone?: string })?.phone ?? '') as string,
    whatsapp: initialVendor?.whatsapp ?? '',
    address: initialVendor?.address ?? '',
    bankAccountName: initialVendor?.bankAccountName ?? '',
    bankAccountNumber: initialVendor?.bankAccountNumber ?? '',
    bankName: initialVendor?.bankName ?? '',
    logoUrl: initialVendor?.logo ?? '',
    coverImageUrl: initialVendor?.coverImage ?? '',
  };

  const {
    formValues,
    formErrors,
    loading: submitting,
    handleInputChange,
    handleSubmit,
    errorsVisible,
    setFormValues,
    isValid,
  } = useForm<typeof vendorSettingsSchema>({
    formSchema: vendorSettingsSchema,
    defaultFormValues: initialFormValues,
    async onSubmit(values: VendorSettingsValues) {
      const payload: IVendorUpdateSettingsPayload = {
        storeName: values.storeName || undefined,
        storeDescription: values.storeDescription || undefined,
        email: values.email || undefined,
        phone: values.phone || undefined,
        whatsapp: values.whatsapp || undefined,
        address: values.address || undefined,
        bankAccountName: values.bankAccountName || undefined,
        bankAccountNumber: values.bankAccountNumber || undefined,
        bankName: values.bankName || undefined,
        logo: values.logoUrl || undefined,
        coverImage: values.coverImageUrl || undefined,
      };

      const { data, error, message } = await callApi('VENDOR_UPDATE_SETTINGS', { payload });

      if (error || !data) {
        toast.error(message || 'Failed to save settings.');
        return false;
      }

      toast.success(message || 'Settings saved.');
      return true;
    },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {initialLoading && <p className="text-sm text-muted-foreground">Loading store settings...</p>}
      {!initialLoading && (
        <>
          <DashboardPageHeader
            title="Store settings"
            description="Configure your store preferences"
          />

          {initialLoadError && !dismissedLoadError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
              <span>{initialLoadError} You can retry or edit and save.</span>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => router.refresh()}>
                  Retry
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => setDismissedLoadError(true)}>
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          <DashboardFormCard
            title="Store status"
            description="Control your store's visibility and availability. (UI only — API support pending.)"
            icon={Eye}>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <p className="font-medium text-foreground">Store visibility</p>
                  <p className="text-sm text-muted-foreground">
                    Make your store visible to customers.
                  </p>
                </div>
                <DashboardSwitch checked={storeVisible} onCheckedChange={setStoreVisible} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">Vacation mode</p>
                  <p className="text-sm text-muted-foreground">
                    Pause new orders while you are away.
                  </p>
                </div>
                <DashboardSwitch checked={vacationMode} onCheckedChange={setVacationMode} />
              </div>
            </div>
          </DashboardFormCard>

          <form onSubmit={handleSubmit} className="space-y-6">
            <DashboardFormCard
              title="Store profile"
              description="Public information about your store."
              icon={Store}>
              <div className="space-y-4">
                <RegularInput
                  label="Store name"
                  name="storeName"
                  required
                  value={formValues.storeName}
                  onChange={handleInputChange}
                  placeholder="Enter store name"
                  disabled={initialLoading || submitting}
                  errors={errorsVisible ? (formErrors.storeName ?? []) : []}
                />
                <RegularTextarea
                  label="Store description"
                  name="storeDescription"
                  value={formValues.storeDescription ?? ''}
                  onChange={handleInputChange}
                  placeholder="Describe your store"
                  rows={3}
                  disabled={initialLoading || submitting}
                />
                <ImageUploadField
                  label="Logo"
                  helperText="Upload your store logo."
                  entityType="vendor"
                  entityId={initialVendor?._id ?? ''}
                  intent="logo"
                  value={formValues.logoUrl ?? ''}
                  onChange={url =>
                    setFormValues(prev => ({
                      ...prev,
                      logoUrl: url,
                    }))
                  }
                />
                <ImageUploadField
                  label="Cover image"
                  helperText="Upload a wide cover image for your store."
                  entityType="vendor"
                  entityId={initialVendor?._id ?? ''}
                  intent="banner-image"
                  value={formValues.coverImageUrl ?? ''}
                  onChange={url =>
                    setFormValues(prev => ({
                      ...prev,
                      coverImageUrl: url,
                    }))
                  }
                />
              </div>
            </DashboardFormCard>

            <DashboardFormCard
              title="Contact information"
              description="How buyers can reach you."
              icon={Phone}>
              <div className="grid gap-4 md:grid-cols-2">
                <RegularInput
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={formValues.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  disabled={initialLoading || submitting}
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
                  disabled={initialLoading || submitting}
                  errors={errorsVisible ? (formErrors.phone ?? []) : []}
                />
                <RegularInput
                  label="WhatsApp"
                  name="whatsapp"
                  type="tel"
                  required
                  value={formValues.whatsapp}
                  onChange={handleInputChange}
                  placeholder="Enter WhatsApp number"
                  disabled={initialLoading || submitting}
                  errors={errorsVisible ? (formErrors.whatsapp ?? []) : []}
                />
                <RegularTextarea
                  label="Address"
                  name="address"
                  value={formValues.address ?? ''}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  rows={2}
                  disabled={initialLoading || submitting}
                  className="md:col-span-2"
                />
              </div>
            </DashboardFormCard>

            <DashboardFormCard
              title="Bank account"
              description="Payout details for your store."
              icon={Landmark}>
              <div className="space-y-4">
                <RegularInput
                  label="Account name"
                  name="bankAccountName"
                  value={formValues.bankAccountName ?? ''}
                  onChange={handleInputChange}
                  placeholder="Bank account name"
                  disabled={initialLoading || submitting}
                />
                <RegularInput
                  label="Account number"
                  name="bankAccountNumber"
                  value={formValues.bankAccountNumber ?? ''}
                  onChange={handleInputChange}
                  placeholder="Bank account number"
                  disabled={initialLoading || submitting}
                />
                <RegularInput
                  label="Bank name"
                  name="bankName"
                  value={formValues.bankName ?? ''}
                  onChange={handleInputChange}
                  placeholder="Bank name"
                  disabled={initialLoading || submitting}
                />
              </div>
            </DashboardFormCard>

            <RegularBtn
              type="submit"
              variant="default"
              className="rounded-full bg-primary hover:bg-primary/90"
              disabled={!isValid || initialLoading || submitting}
              loading={submitting}
              onDisabledClick={() => {
                const messages = getSettingsValidationMessages(formValues, formErrors);
                if (messages.length > 0) {
                  toast.error(messages.length === 1 ? messages[0] : messages.join('. '));
                } else if (submitting) {
                  toast.info('Please wait, saving settings…');
                }
              }}>
              {submitting ? 'Saving…' : 'Save settings'}
            </RegularBtn>
          </form>
        </>
      )}
    </div>
  );
}
