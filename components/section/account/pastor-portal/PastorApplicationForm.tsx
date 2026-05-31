'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { ImageUploadField } from '@/components/general/MediaUploadField';
import { useForm } from '@/lib/hooks/use-form';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/useAuthStore';
import type { ApiErrorResponse } from '@/lib/types/http';
import type { IPastorApplication } from '@/lib/constants/endpoints';

const optionalStoredImageUrl = z
  .string()
  .optional()
  .refine(v => v == null || v === '' || /^https?:\/\/.+/i.test(v), 'Must be a valid image URL');

const pastorApplicationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().optional(),
  church: z.string().optional(),
  bio: z.string().optional(),
  image: optionalStoredImageUrl,
  motivation: z.string().optional(),
});

type PastorApplicationValues = z.infer<typeof pastorApplicationSchema>;

export interface PastorApplicationFormProps {
  initialApplication?: IPastorApplication | null;
}

export function PastorApplicationForm({ initialApplication }: PastorApplicationFormProps) {
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  const userId =
    user && typeof user === 'object' && '_id' in user ? String((user as { _id: string })._id) : '';
  const [expertiseInput, setExpertiseInput] = useState(
    (initialApplication?.expertise ?? []).join(', ')
  );

  const { formValues, formErrors, loading, handleInputChange, handleSubmit, errorsVisible } =
    useForm<typeof pastorApplicationSchema>({
      formSchema: pastorApplicationSchema,
      defaultFormValues: {
        name: initialApplication?.name ?? '',
        title: initialApplication?.title ?? '',
        church: initialApplication?.church ?? '',
        bio: initialApplication?.bio ?? '',
        image: initialApplication?.image ?? '',
        motivation: initialApplication?.motivation ?? '',
      },
      async onSubmit(values: PastorApplicationValues) {
        const expertise = expertiseInput
          .split(',')
          .map(item => item.trim())
          .filter(Boolean);

        const { data, error } = await callApi('PASTOR_SUBMIT_APPLICATION', {
          payload: {
            name: values.name.trim(),
            title: values.title?.trim() || undefined,
            church: values.church?.trim() || undefined,
            bio: values.bio?.trim() || undefined,
            image: values.image?.trim() || undefined,
            motivation: values.motivation?.trim() || undefined,
            expertise: expertise.length > 0 ? expertise : undefined,
          },
        });

        if (error || !data) {
          const code = (error as ApiErrorResponse | undefined)?.responseCode;
          toast.error(
            code === 429
              ? 'You must wait before reapplying. Check the cooldown message above.'
              : ((error as ApiErrorResponse | undefined)?.message ??
                  'Unable to submit application.')
          );
          return false;
        }

        toast.success('Application submitted. We will review it and notify you.');
        router.refresh();
        return true;
      },
    });

  return (
    <Card className="max-w-2xl mx-auto border-border/60">
      <CardContent className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Pastor application</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tell us about your ministry. An admin will review your application before your pastor
            portal unlocks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <RegularInput
            id="pastor-name"
            name="name"
            label="Full name"
            value={formValues.name}
            onChange={handleInputChange}
            errors={errorsVisible ? formErrors.name : undefined}
            required
          />
          <RegularInput
            id="pastor-title"
            name="title"
            label="Title"
            value={formValues.title ?? ''}
            onChange={handleInputChange}
            placeholder="e.g. Senior Pastor"
          />
          <RegularInput
            id="pastor-church"
            name="church"
            label="Church / Ministry"
            value={formValues.church ?? ''}
            onChange={handleInputChange}
          />
          <RegularTextarea
            id="pastor-bio"
            name="bio"
            label="Bio"
            value={formValues.bio ?? ''}
            onChange={handleInputChange}
            rows={4}
          />
          <RegularInput
            id="pastor-expertise"
            name="expertise"
            label="Areas of expertise (comma-separated)"
            value={expertiseInput}
            onChange={e => setExpertiseInput(e.target.value)}
            placeholder="Faith, Marriage, Prayer"
          />
          <RegularTextarea
            id="pastor-motivation"
            name="motivation"
            label="Why do you want to join?"
            value={formValues.motivation ?? ''}
            onChange={handleInputChange}
            rows={3}
          />
          <ImageUploadField
            label="Profile photo"
            value={formValues.image ?? ''}
            onChange={value => handleInputChange({ target: { name: 'image', value } } as never)}
            entityType="pastor"
            entityId={userId || 'pastor-application'}
            intent="image"
          />
          <RegularBtn type="submit" text="Submit application" loading={loading} size="full" />
        </form>
      </CardContent>
    </Card>
  );
}
