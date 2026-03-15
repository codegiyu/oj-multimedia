/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Card } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useForm } from '@/lib/hooks/use-form';
import {
  AudioUploadField,
  ImageUploadField,
  VideoUploadField,
} from '@/components/general/MediaUploadField';
import { callApi } from '@/lib/services/callApi';
import type { ArtistMusicListItem, ArtistVideoListItem } from '@/lib/constants/endpoints';
import type { ApiErrorResponse } from '@/lib/types/http';

type UploadType = 'music' | 'video';

const musicUploadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  audioUrl: z.string().url('Please enter a valid audio URL').optional().or(z.literal('')),
  coverImage: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
});

type MusicUploadValues = z.infer<typeof musicUploadSchema>;

const videoUploadSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  videoUrl: z.string().url('Please enter a valid video URL').optional().or(z.literal('')),
  thumbnail: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
});

type VideoUploadValues = z.infer<typeof videoUploadSchema>;

export interface ArtistPortalUploadPageClientProps {
  initialHasArtistProfile: boolean;
  initialLoadError: string | null;
  initialMusicItem: ArtistMusicListItem | null;
  initialVideoItem: ArtistVideoListItem | null;
  editId: string;
  editType: 'music' | 'video';
}

export function ArtistPortalUploadPageClient({
  initialHasArtistProfile,
  initialLoadError,
  initialMusicItem,
  initialVideoItem,
  editId,
  editType,
}: ArtistPortalUploadPageClientProps) {
  const router = useRouter();
  const [uploadType, setUploadType] = useState<UploadType>(editId ? editType : 'music');

  const isEditMusic = editId && editType === 'music';
  const isEditVideo = editId && editType === 'video';

  const musicDefaultValues: MusicUploadValues = {
    title: initialMusicItem?.title ?? '',
    description: initialMusicItem?.description ?? '',
    audioUrl: initialMusicItem?.audioUrl ?? '',
    coverImage: initialMusicItem?.coverImage ?? '',
  };

  const videoDefaultValues: VideoUploadValues = {
    title: initialVideoItem?.title ?? '',
    description: initialVideoItem?.description ?? '',
    videoUrl: initialVideoItem?.videoUrl ?? '',
    thumbnail: initialVideoItem?.thumbnail ?? '',
  };

  const {
    formValues: musicValues,
    formErrors: musicErrors,
    loading: musicSubmitting,
    handleInputChange: handleMusicInputChange,
    handleSubmit: handleMusicSubmit,
    errorsVisible: musicErrorsVisible,
    setFormValues: setMusicFormValues,
  } = useForm<typeof musicUploadSchema>({
    formSchema: musicUploadSchema,
    defaultFormValues: musicDefaultValues,
    async onSubmit(values: MusicUploadValues) {
      if (!isEditMusic && !values.audioUrl?.trim()) {
        toast.error('Please add an audio file or URL for new tracks.');
        return false;
      }
      const payload = {
        title: values.title,
        description: values.description || undefined,
        audioUrl: values.audioUrl || undefined,
        coverImage: values.coverImage || undefined,
      };

      if (isEditMusic) {
        const { data, error, message } = await callApi('ARTIST_UPDATE_MUSIC', {
          payload,
          query: `/${editId}`,
        });
        if (error || !data) {
          const responseCode = (error as ApiErrorResponse | undefined)?.responseCode;
          if (responseCode === 403 || responseCode === 404) {
            toast.error('You need an artist profile to update music.');
            return false;
          }
          toast.error(message || 'Failed to update track.');
          return false;
        }
        toast.success('Track updated.');
        router.push('/account/artist-portal/music');
        return true;
      }

      const { data, error, message } = await callApi('ARTIST_CREATE_MUSIC', {
        payload,
      });
      if (error || !data) {
        const responseCode = (error as ApiErrorResponse | undefined)?.responseCode;
        if (responseCode === 403 || responseCode === 404) {
          toast.error('You need an artist profile to upload music.');
          return false;
        }
        toast.error(message || 'Failed to upload music.');
        return false;
      }
      toast.success('Music uploaded.');
      router.push('/account/artist-portal/music');
      return true;
    },
  });

  const {
    formValues: videoValues,
    formErrors: videoErrors,
    loading: videoSubmitting,
    handleInputChange: handleVideoInputChange,
    handleSubmit: handleVideoSubmit,
    errorsVisible: videoErrorsVisible,
    setFormValues: setVideoFormValues,
  } = useForm<typeof videoUploadSchema>({
    formSchema: videoUploadSchema,
    defaultFormValues: videoDefaultValues,
    async onSubmit(values: VideoUploadValues) {
      if (!isEditVideo && !values.videoUrl?.trim()) {
        toast.error('Please add a video file or URL for new videos.');
        return false;
      }
      const payload = {
        title: values.title,
        description: values.description || undefined,
        videoUrl: values.videoUrl || undefined,
        thumbnail: values.thumbnail || undefined,
      };

      if (isEditVideo) {
        const { data, error, message } = await callApi('ARTIST_UPDATE_VIDEO', {
          payload,
          query: `/${editId}`,
        });
        if (error || !data) {
          const responseCode = (error as ApiErrorResponse | undefined)?.responseCode;
          if (responseCode === 403 || responseCode === 404) {
            toast.error('You need an artist profile to update videos.');
            return false;
          }
          toast.error(message || 'Failed to update video.');
          return false;
        }
        toast.success('Video updated.');
        router.push('/account/artist-portal/videos');
        return true;
      }

      const { data, error, message } = await callApi('ARTIST_CREATE_VIDEO', {
        payload,
      });
      if (error || !data) {
        const responseCode = (error as ApiErrorResponse | undefined)?.responseCode;
        if (responseCode === 403 || responseCode === 404) {
          toast.error('You need an artist profile to upload videos.');
          return false;
        }
        toast.error(message || 'Failed to upload video.');
        return false;
      }
      toast.success('Video uploaded.');
      router.push('/account/artist-portal/videos');
      return true;
    },
  });

  useEffect(() => {
    if (initialMusicItem) {
      setMusicFormValues(prev => ({
        ...prev,
        title: initialMusicItem.title ?? prev.title,
        description: initialMusicItem.description ?? prev.description,
        audioUrl: initialMusicItem.audioUrl ?? prev.audioUrl,
        coverImage: initialMusicItem.coverImage ?? prev.coverImage,
      }));
    }
  }, [initialMusicItem]);

  useEffect(() => {
    if (initialVideoItem) {
      setVideoFormValues(prev => ({
        ...prev,
        title: initialVideoItem.title ?? prev.title,
        description: initialVideoItem.description ?? prev.description,
        videoUrl: initialVideoItem.videoUrl ?? prev.videoUrl,
        thumbnail: initialVideoItem.thumbnail ?? prev.thumbnail,
      }));
    }
  }, [initialVideoItem]);

  if (!initialHasArtistProfile) {
    return (
      <SectionContainer>
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Complete your artist profile to upload music and videos.
            </p>
            <Button asChild variant="outline">
              <Link href="/account/artist-portal/settings">Go to settings</Link>
            </Button>
          </Card>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {isEditMusic || isEditVideo ? 'Edit content' : 'Upload content'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMusic || isEditVideo
              ? 'Update your music or video details.'
              : 'Upload new music or video content. Use the upload fields to attach files via presigned URLs.'}
          </p>
        </div>

        {initialLoadError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {initialLoadError}
          </div>
        )}

        <Card className="p-6 md:p-8">
          <Tabs
            value={uploadType}
            onValueChange={val => setUploadType(val as UploadType)}
            className="space-y-6">
            <TabsList>
              <TabsTrigger value="music">Music</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
            </TabsList>

            <TabsContent value="music">
              <form onSubmit={handleMusicSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="musicTitle">Title</Label>
                  <RegularInput
                    id="musicTitle"
                    name="title"
                    value={musicValues.title}
                    onChange={handleMusicInputChange}
                    required
                    errors={musicErrorsVisible ? (musicErrors.title ?? []) : []}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="musicDescription">Description (optional)</Label>
                  <RegularTextarea
                    id="musicDescription"
                    rows={3}
                    name="description"
                    value={musicValues.description ?? ''}
                    onChange={handleMusicInputChange}
                    errors={musicErrorsVisible ? (musicErrors.description ?? []) : []}
                  />
                </div>
                <AudioUploadField
                  label="Audio file"
                  helperText="Upload the audio file for this track."
                  entityType="user"
                  entityId=""
                  intent="other"
                  value={musicValues.audioUrl ?? ''}
                  onChange={url =>
                    handleMusicInputChange({
                      target: { name: 'audioUrl', value: url } as unknown as HTMLInputElement,
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                />
                <ImageUploadField
                  label="Cover image"
                  helperText="Upload an optional cover image for this track."
                  entityType="user"
                  entityId=""
                  intent="card-image"
                  value={musicValues.coverImage ?? ''}
                  onChange={url =>
                    handleMusicInputChange({
                      target: { name: 'coverImage', value: url } as unknown as HTMLInputElement,
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                />
                <RegularBtn
                  type="submit"
                  variant="default"
                  className="bg-primary hover:bg-primary/90"
                  disabled={musicSubmitting}
                  loading={musicSubmitting}
                  onDisabledClick={() => {
                    if (musicSubmitting) {
                      toast.info('Please wait, submitting…');
                    }
                  }}>
                  {musicSubmitting ? 'Submitting…' : isEditMusic ? 'Update track' : 'Upload music'}
                </RegularBtn>
              </form>
            </TabsContent>

            <TabsContent value="video">
              <form onSubmit={handleVideoSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="videoTitle">Title</Label>
                  <RegularInput
                    id="videoTitle"
                    name="title"
                    value={videoValues.title}
                    onChange={handleVideoInputChange}
                    required
                    errors={videoErrorsVisible ? (videoErrors.title ?? []) : []}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="videoDescription">Description (optional)</Label>
                  <RegularTextarea
                    id="videoDescription"
                    rows={3}
                    name="description"
                    value={videoValues.description ?? ''}
                    onChange={handleVideoInputChange}
                    errors={videoErrorsVisible ? (videoErrors.description ?? []) : []}
                  />
                </div>
                <VideoUploadField
                  label="Video file"
                  helperText="Upload the video file for this content."
                  entityType="user"
                  entityId=""
                  intent="other"
                  value={videoValues.videoUrl ?? ''}
                  onChange={url =>
                    handleVideoInputChange({
                      target: { name: 'videoUrl', value: url } as unknown as HTMLInputElement,
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                />
                <ImageUploadField
                  label="Thumbnail image"
                  helperText="Upload an optional thumbnail image for this video."
                  entityType="user"
                  entityId=""
                  intent="card-image"
                  value={videoValues.thumbnail ?? ''}
                  onChange={url =>
                    handleVideoInputChange({
                      target: { name: 'thumbnail', value: url } as unknown as HTMLInputElement,
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                />
                <RegularBtn
                  type="submit"
                  variant="default"
                  className="bg-primary hover:bg-primary/90"
                  disabled={videoSubmitting}
                  loading={videoSubmitting}
                  onDisabledClick={() => {
                    if (videoSubmitting) {
                      toast.info('Please wait, submitting…');
                    }
                  }}>
                  {videoSubmitting ? 'Submitting…' : isEditVideo ? 'Update video' : 'Upload video'}
                </RegularBtn>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </SectionContainer>
  );
}
