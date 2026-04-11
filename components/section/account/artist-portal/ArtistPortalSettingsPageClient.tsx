'use client';

import { useState } from 'react';
import { z } from 'zod';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Card } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useForm } from '@/lib/hooks/use-form';
import { callApi } from '@/lib/services/callApi';
import { ImageUploadField } from '@/components/general/MediaUploadField';
import type { ClientArtistProfile } from '@/lib/constants/endpoints';
import type { ApiErrorResponse } from '@/lib/types/http';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const artistSettingsSchema = z.object({
  name: z.string().min(1, 'Artist name is required'),
  bio: z.string().optional(),
  image: z.url('Please enter a valid image URL').optional().or(z.literal('')),
  coverImage: z.url('Please enter a valid image URL').optional().or(z.literal('')),
  genre: z.string().optional(),
  facebook: z.url('Please enter a valid URL').optional().or(z.literal('')),
  instagram: z.url('Please enter a valid URL').optional().or(z.literal('')),
  twitter: z.url('Please enter a valid URL').optional().or(z.literal('')),
  youtube: z.url('Please enter a valid URL').optional().or(z.literal('')),
  website: z.url('Please enter a valid URL').optional().or(z.literal('')),
});

type ArtistSettingsValues = z.infer<typeof artistSettingsSchema>;

export interface ArtistPortalSettingsPageClientProps {
  initialArtist: ClientArtistProfile | null;
  initialHasArtistProfile: boolean;
  initialLoadError: string | null;
}

export function ArtistPortalSettingsPageClient({
  initialArtist,
  initialHasArtistProfile,
  initialLoadError = null,
}: ArtistPortalSettingsPageClientProps) {
  const router = useRouter();
  const [dismissedLoadError, setDismissedLoadError] = useState(false);

  const socials = initialArtist?.socials;
  const initialFormValues: ArtistSettingsValues = {
    name: initialArtist?.name ?? '',
    bio: initialArtist?.bio ?? '',
    image: initialArtist?.image ?? '',
    coverImage: initialArtist?.coverImage ?? '',
    genre: initialArtist?.genre ?? '',
    facebook: socials?.facebook ?? '',
    instagram: socials?.instagram ?? '',
    twitter: socials?.twitter ?? '',
    youtube: socials?.youtube ?? '',
    website: socials?.website ?? '',
  };

  const {
    formValues,
    formErrors,
    loading,
    handleInputChange,
    handleSubmit,
    errorsVisible,
    setFormValues,
  } = useForm<typeof artistSettingsSchema>({
    formSchema: artistSettingsSchema,
    defaultFormValues: initialFormValues,
    async onSubmit(values: ArtistSettingsValues) {
      const payload = {
        name: values.name || undefined,
        bio: values.bio || undefined,
        image: values.image || undefined,
        coverImage: values.coverImage || undefined,
        genre: values.genre || undefined,
        socials:
          values.facebook || values.instagram || values.twitter || values.youtube || values.website
            ? {
                ...(values.facebook && { facebook: values.facebook }),
                ...(values.instagram && { instagram: values.instagram }),
                ...(values.twitter && { twitter: values.twitter }),
                ...(values.youtube && { youtube: values.youtube }),
                ...(values.website && { website: values.website }),
              }
            : undefined,
      };

      const { data, error, message } = await callApi('ARTIST_UPDATE_ME', {
        payload,
      });

      if (error || !data) {
        const responseCode = (error as ApiErrorResponse | undefined)?.responseCode;
        if (responseCode === 403 || responseCode === 404) {
          toast.error('You need an artist profile to save settings.');
          return false;
        }
        toast.error(message || 'Failed to save artist profile.');
        return false;
      }

      toast.success('Artist profile saved.');
      return true;
    },
  });

  if (!initialHasArtistProfile) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <DashboardPageHeader title="My account" description="Artist profile and public presence" />
        <Card className="border-border/80 p-8 text-center shadow-sm">
          <p className="text-muted-foreground mb-4">
            Complete your artist profile to manage your music and videos. Contact support if you
            need an artist account.
          </p>
          <Button variant="outline" className="rounded-full" onClick={() => router.refresh()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <DashboardPageHeader
        title="My account"
        description="Update your artist profile, imagery, and social links."
      />

      {initialLoadError && !dismissedLoadError && (
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

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Artist name</Label>
            <RegularInput
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              required
              errors={errorsVisible ? (formErrors.name ?? []) : []}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <RegularTextarea
              id="bio"
              name="bio"
              rows={4}
              value={formValues.bio ?? ''}
              onChange={handleInputChange}
              errors={errorsVisible ? (formErrors.bio ?? []) : []}
            />
          </div>

          <ImageUploadField
            label="Profile image"
            helperText="Upload a square image for your artist profile."
            entityType="artist"
            entityId=""
            intent="avatar"
            value={formValues.image ?? ''}
            onChange={url =>
              setFormValues(prev => ({
                ...prev,
                image: url,
              }))
            }
          />

          <ImageUploadField
            label="Cover image"
            helperText="Upload a wide image for your artist banner."
            entityType="artist"
            entityId=""
            intent="banner-image"
            value={formValues.coverImage ?? ''}
            onChange={url =>
              setFormValues(prev => ({
                ...prev,
                coverImage: url,
              }))
            }
          />

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <RegularInput
              id="genre"
              name="genre"
              value={formValues.genre ?? ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-4 pt-2 border-t border-border">
            <h3 className="text-sm font-medium text-foreground">Social links (optional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <RegularInput
                  id="facebook"
                  name="facebook"
                  type="url"
                  placeholder="https://..."
                  value={formValues.facebook ?? ''}
                  onChange={handleInputChange}
                  errors={errorsVisible ? (formErrors.facebook ?? []) : []}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <RegularInput
                  id="instagram"
                  name="instagram"
                  type="url"
                  placeholder="https://..."
                  value={formValues.instagram ?? ''}
                  onChange={handleInputChange}
                  errors={errorsVisible ? (formErrors.instagram ?? []) : []}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <RegularInput
                  id="twitter"
                  name="twitter"
                  type="url"
                  placeholder="https://..."
                  value={formValues.twitter ?? ''}
                  onChange={handleInputChange}
                  errors={errorsVisible ? (formErrors.twitter ?? []) : []}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <RegularInput
                  id="youtube"
                  name="youtube"
                  type="url"
                  placeholder="https://..."
                  value={formValues.youtube ?? ''}
                  onChange={handleInputChange}
                  errors={errorsVisible ? (formErrors.youtube ?? []) : []}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="website">Website</Label>
                <RegularInput
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://..."
                  value={formValues.website ?? ''}
                  onChange={handleInputChange}
                  errors={errorsVisible ? (formErrors.website ?? []) : []}
                />
              </div>
            </div>
          </div>

          <RegularBtn
            type="submit"
            variant="default"
            className="bg-primary hover:bg-primary/90"
            disabled={loading}
            loading={loading}
            onDisabledClick={() => {
              if (loading) {
                toast.info('Please wait, saving settings…');
              }
            }}>
            {loading ? 'Saving…' : 'Save settings'}
          </RegularBtn>
        </form>
      </Card>
    </div>
  );
}
