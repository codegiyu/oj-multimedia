'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Card } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { ImageUploadField } from '@/components/general/MediaUploadField';
import { useForm } from '@/lib/hooks/use-form';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type { ClientPastorProfile } from '@/lib/constants/endpoints';
import { Button } from '@/components/ui/button';
import { RoleAccountDeactivateSection } from '@/components/section/account/shared/RoleAccountDeactivateSection';

const optionalStoredImageUrl = z
  .string()
  .optional()
  .refine(v => v == null || v === '' || /^https?:\/\/.+/i.test(v), 'Must be a valid image URL');

const pastorSettingsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().optional(),
  church: z.string().optional(),
  bio: z.string().optional(),
  image: optionalStoredImageUrl,
});

type PastorSettingsValues = z.infer<typeof pastorSettingsSchema>;

export interface PastorPortalSettingsPageClientProps {
  initialPastor: ClientPastorProfile | null;
  initialLoadError: string | null;
  portalStatus?: string;
}

export function PastorPortalSettingsPageClient({
  initialPastor,
  initialLoadError = null,
  portalStatus,
}: PastorPortalSettingsPageClientProps) {
  const router = useRouter();
  const [expertiseInput, setExpertiseInput] = useState((initialPastor?.expertise ?? []).join(', '));
  const [dismissedLoadError, setDismissedLoadError] = useState(false);

  const { formValues, formErrors, loading, handleInputChange, handleSubmit, errorsVisible } =
    useForm<typeof pastorSettingsSchema>({
      formSchema: pastorSettingsSchema,
      defaultFormValues: {
        name: initialPastor?.name ?? '',
        title: initialPastor?.title ?? '',
        church: initialPastor?.church ?? '',
        bio: initialPastor?.bio ?? '',
        image: initialPastor?.image ?? '',
      },
      async onSubmit(values: PastorSettingsValues) {
        const expertise = expertiseInput
          .split(',')
          .map(item => item.trim())
          .filter(Boolean);

        const res = await callApi('PASTOR_UPDATE_PROFILE', {
          payload: {
            name: values.name.trim(),
            title: values.title?.trim() || undefined,
            church: values.church?.trim() || undefined,
            bio: values.bio?.trim() || undefined,
            image: values.image?.trim() || undefined,
            expertise: expertise.length > 0 ? expertise : undefined,
          },
        });

        if (res.error) {
          toast.error(res.error.message ?? 'Unable to update profile.');
          return false;
        }

        toast.success('Profile updated.');
        router.refresh();
        return true;
      },
    });

  return (
    <div className="space-y-6 max-w-2xl">
      <DashboardPageHeader
        title="Pastor settings"
        description="Update your public pastor profile"
      />

      {initialLoadError && !dismissedLoadError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center justify-between gap-4">
          <span>{initialLoadError}</span>
          <Button variant="outline" size="sm" onClick={() => setDismissedLoadError(true)}>
            Dismiss
          </Button>
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <RegularInput
            id="settings-name"
            name="name"
            label="Name"
            value={formValues.name}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.name : undefined}
            required
          />
          <RegularInput
            id="settings-title"
            name="title"
            label="Title"
            value={formValues.title ?? ''}
            onChange={handleInputChange}
          />
          <RegularInput
            id="settings-church"
            name="church"
            label="Church"
            value={formValues.church ?? ''}
            onChange={handleInputChange}
          />
          <RegularTextarea
            id="settings-bio"
            name="bio"
            label="Bio"
            value={formValues.bio ?? ''}
            onChange={handleInputChange}
            rows={4}
          />
          <RegularInput
            id="settings-expertise"
            name="expertise"
            label="Expertise (comma-separated)"
            value={expertiseInput}
            onChange={e => setExpertiseInput(e.target.value)}
          />
          <ImageUploadField
            label="Profile photo"
            value={formValues.image ?? ''}
            onChange={value => handleInputChange({ target: { name: 'image', value } } as never)}
            entityType="pastor"
            entityId={initialPastor?._id ?? 'pastor-settings'}
            intent="image"
          />
          <RegularBtn type="submit" text="Save changes" loading={loading} />
        </form>
      </Card>

      {initialPastor ? (
        <RoleAccountDeactivateSection
          profileLabel="pastor profile"
          deactivateEndpoint="PASTOR_DEACTIVATE_ME"
          isDeactivated={portalStatus === 'deactivated'}
        />
      ) : null}
    </div>
  );
}
