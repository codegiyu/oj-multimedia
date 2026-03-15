'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from '@/lib/hooks/use-form';
import { callApi } from '@/lib/services/callApi';
import { ImageUploadField } from '@/components/general/MediaUploadField';
import type { IVendorMeRes, IVendorUpdateSettingsPayload } from '@/lib/constants/endpoints';
import type { ApiErrorResponse } from '@/lib/types/http';
import { VendorCreateStoreState } from './VendorCreateStoreState';

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
  logoUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  coverImageUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
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
  initialHasVendorProfile: boolean;
  initialLoadError?: string | null;
}

export function VendorSettingsPageClient({
  initialVendor,
  initialHasVendorProfile,
  initialLoadError = null,
}: VendorSettingsPageClientProps) {
  const router = useRouter();
  const [initialLoading] = useState(false);
  const [hasVendorProfile, setHasVendorProfile] = useState<boolean | null>(initialHasVendorProfile);
  const [dismissedLoadError, setDismissedLoadError] = useState(false);

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
        const responseCode = (error as ApiErrorResponse | undefined)?.responseCode;

        if (responseCode === 403 || responseCode === 404) {
          setHasVendorProfile(false);
        }

        toast.error(message || 'Failed to save settings.');
        return false;
      }

      toast.success(message || 'Settings saved.');
      return true;
    },
  });

  return (
    <SectionContainer>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Settings className="w-8 h-8 text-primary" />
          Vendor Settings
        </h1>
        {initialLoading && (
          <p className="text-sm text-muted-foreground mb-4">Loading store settings...</p>
        )}
        {!initialLoading && hasVendorProfile === false && (
          <VendorCreateStoreState description="You need a vendor store before you can configure vendor settings. Become a vendor to start selling on the marketplace." />
        )}

        {hasVendorProfile !== false && initialLoadError && !dismissedLoadError && (
          <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
            <span>{initialLoadError} You can retry or edit and save.</span>
            <div className="flex gap-2 shrink-0">
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

        {hasVendorProfile !== false && (
          <Card className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Store profile</h2>
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
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Contact</h2>
                <div className="space-y-4">
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
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Bank account</h2>
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
              </div>

              <RegularBtn
                type="submit"
                variant="default"
                className="bg-primary hover:bg-primary/90"
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
          </Card>
        )}
      </div>
    </SectionContainer>
  );
}
