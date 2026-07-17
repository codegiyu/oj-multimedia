'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { ImageUploadField } from '@/components/general/MediaUploadField';
import { toast } from 'sonner';
import { useForm } from '@/lib/hooks/use-form';
import { callApi } from '@/lib/services/callApi';
import { useAuthStore, useInitAuthStore } from '@/lib/store/useAuthStore';
import type { ApiErrorResponse } from '@/lib/types/http';

const optionalStoredImageUrl = z
  .string()
  .optional()
  .refine(v => v == null || v === '' || /^https?:\/\/.+/i.test(v), 'Must be a valid image URL');

const becomeArtistSchema = z.object({
  name: z.string().min(1, 'Artist name is required'),
  bio: z.string().optional(),
  genre: z.string().optional(),
  image: optionalStoredImageUrl,
  coverImage: optionalStoredImageUrl,
});

type BecomeArtistValues = z.infer<typeof becomeArtistSchema>;

export interface BecomeArtistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BecomeArtistModal({ open, onOpenChange }: BecomeArtistModalProps) {
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  const userId =
    user && typeof user === 'object' && '_id' in user ? String((user as { _id: string })._id) : '';

  const {
    formValues,
    formErrors,
    loading,
    handleInputChange,
    handleSubmit,
    errorsVisible,
    setFormValues,
    isValid,
  } = useForm<typeof becomeArtistSchema>({
    formSchema: becomeArtistSchema,
    defaultFormValues: {
      name: '',
      bio: '',
      genre: '',
      image: '',
      coverImage: '',
    },
    async onSubmit(values: BecomeArtistValues) {
      const { data, error, message } = await callApi('ARTIST_CREATE_ME', {
        payload: {
          name: values.name.trim(),
          bio: values.bio?.trim() || undefined,
          genre: values.genre?.trim() || undefined,
          image: values.image?.trim() || undefined,
          coverImage: values.coverImage?.trim() || undefined,
        },
      });

      if (error || !data) {
        const code = (error as ApiErrorResponse | undefined)?.responseCode;
        if (code === 403 || code === 404) {
          toast.error(
            message ||
              'We could not create an artist profile from your account yet. Please contact support.'
          );
          return false;
        }
        if (code === 409) {
          toast.error(message || 'You already have an artist profile. Refresh the page.');
          return false;
        }
        toast.error(message || 'Failed to create artist profile.');
        return false;
      }

      toast.success('Artist profile saved. Welcome to the portal!');
      onOpenChange(false);
      await useInitAuthStore.getState().actions.initSession();
      router.refresh();
      return true;
    },
  });

  const [resetKey, setResetKey] = useState(0);

  return (
    <Dialog
      open={open}
      onOpenChange={v => {
        if (!v) {
          setResetKey(k => k + 1);
        }
        onOpenChange(v);
      }}>
      <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Become an artist</DialogTitle>
          <DialogDescription>
            Create your public artist profile. You can add more details later in Artist Portal
            settings.
          </DialogDescription>
        </DialogHeader>

        <form key={resetKey} onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="become-artist-name">Artist name</Label>
            <RegularInput
              id="become-artist-name"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              required
              errors={errorsVisible ? (formErrors.name ?? []) : []}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="become-artist-bio">Bio (optional)</Label>
            <RegularTextarea
              id="become-artist-bio"
              name="bio"
              rows={3}
              value={formValues.bio ?? ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="become-artist-genre">Genre (optional)</Label>
            <RegularInput
              id="become-artist-genre"
              name="genre"
              value={formValues.genre ?? ''}
              onChange={handleInputChange}
            />
          </div>

          <ImageUploadField
            label="Profile image"
            helperText="Square image works best. Uses your account until the artist profile exists."
            entityType="artist"
            entityId={userId}
            intent="avatar"
            value={formValues.image ?? ''}
            onChange={url => setFormValues(prev => ({ ...prev, image: url }))}
          />
          <ImageUploadField
            label="Cover image"
            helperText="Wide banner for your artist page (optional)."
            entityType="artist"
            entityId={userId}
            intent="banner-image"
            value={formValues.coverImage ?? ''}
            onChange={url => setFormValues(prev => ({ ...prev, coverImage: url }))}
          />

          <RegularBtn
            type="submit"
            variant="default"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={loading || !isValid}
            loading={loading}
            onDisabledClick={() => {
              if (loading) toast.info('Saving…');
            }}>
            {loading ? 'Saving…' : 'Create artist profile'}
          </RegularBtn>
        </form>
      </DialogContent>
    </Dialog>
  );
}
