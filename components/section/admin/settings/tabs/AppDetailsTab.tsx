/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { ClientSiteSettings } from '@/lib/constants/endpoints';
import { useSiteSettingsStore } from '@/lib/store/useSiteSettingsStore';
import { useForm } from '@/lib/hooks/use-form';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import { MediaUrlOrUploadField } from '@/components/general/MediaUrlOrUploadField';

const appDetailsSchema = z.object({
  appName: z.string().min(1, 'App name is required'),
  description: z.string().min(1, 'Description is required'),
  logo: z.string(),
});

type AppDetailsFormValues = z.infer<typeof appDetailsSchema>;

interface AppDetailsTabProps {
  settings: Partial<ClientSiteSettings>;
}

export const AppDetailsTab = ({ settings }: AppDetailsTabProps) => {
  const {
    actions: { updateSettings },
  } = useSiteSettingsStore(state => state);

  const {
    formValues,
    formErrors,
    errorsVisible,
    loading,
    handleInputChange,
    handleSubmit,
    setFormErrors,
    setFormValues,
  } = useForm<typeof appDetailsSchema>({
    formSchema: appDetailsSchema,
    defaultFormValues: {
      appName: settings.appDetails?.appName || '',
      description: settings.appDetails?.description || '',
      logo: settings.appDetails?.logo || '',
    },
    noFocusOnFirstField: true,
    onSubmit: async (values: AppDetailsFormValues) => {
      try {
        let finalLogo = values.logo;
        if (pendingLogoFile) {
          const upload = await logoUpload.uploadFile({ file: pendingLogoFile });
          if (!upload?.url) throw new Error('Logo upload failed');
          finalLogo = upload.url;
        }
        const appDetailsValue = { ...values, logo: finalLogo };
        const { data, error } = await callApi('ADMIN_UPDATE_SITE_SETTINGS', {
          payload: {
            settingsPayload: [{ name: 'appDetails', value: appDetailsValue }],
          },
        });

        if (error || !data) {
          setFormErrors({ root: [error?.message || 'Failed to update app details'] });
          return false;
        }

        updateSettings({ appDetails: appDetailsValue });
        toast.success('App details updated successfully');
        return true;
      } catch {
        setFormErrors({ root: ['An unexpected error occurred'] });
        return false;
      }
    },
  });

  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);

  // Use file upload hook for logo
  const logoUpload = useFileUpload({
    entityType: 'admin',
    entityId: 'settings', // Generic ID for settings
    intent: 'logo',
  });

  // Update form when settings change
  useEffect(() => {
    console.log('settings', settings);
    if (settings.appDetails) {
      setFormValues({
        appName: settings.appDetails.appName || '',
        description: settings.appDetails.description || '',
        logo: settings.appDetails.logo ?? '',
      });
    }
  }, [settings]);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-foreground">App Details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your application&apos;s basic information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 grid gap-6">
        {errorsVisible && formErrors.root && formErrors.root.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
            {formErrors.root[0]}
          </div>
        )}

        <MediaUrlOrUploadField
          label="Logo URL"
          value={formValues.logo}
          onChange={value => setFormValues(prev => ({ ...prev, logo: value }))}
          entityType="admin"
          entityId="settings"
          fallbackEntityIdPrefix="app-details-logo"
          intent="logo"
          accept="image/*"
          defaultMode="upload"
          onPendingFileChange={setPendingLogoFile}
        />

        <RegularInput
          label="App Name"
          name="appName"
          value={formValues.appName}
          onChange={handleInputChange}
          placeholder="Enter your app name"
          errors={errorsVisible ? formErrors.appName : []}
          required
        />

        <RegularTextarea
          label="Description"
          name="description"
          value={formValues.description}
          onChange={handleInputChange}
          placeholder="Brief description of your application"
          rows={4}
          errors={errorsVisible ? formErrors.description : []}
          required
        />

        <div className="flex justify-end pt-4 border-t">
          <RegularBtn
            type="submit"
            text="Save Changes"
            LeftIcon={Save}
            leftIconProps={{ className: 'size-4' }}
            loading={loading}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};
