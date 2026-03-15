'use client';

import { useState } from 'react';
import { Upload, Music, Image as ImageIcon, FileAudio, X } from 'lucide-react';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import type { SelectOption } from '@/lib/types/general';
import { z } from 'zod';

const categoryOptions: SelectOption[] = [
  { value: 'afrobeats', text: 'Afrobeats' },
  { value: 'hiphop', text: 'Hip-Hop' },
  { value: 'pop', text: 'Pop' },
  { value: 'rnb', text: 'R&B' },
  { value: 'gospel', text: 'Gospel' },
  { value: 'instrumental', text: 'Instrumental' },
  { value: 'acoustic', text: 'Acoustic' },
  { value: 'worship', text: 'Worship' },
  { value: 'spoken', text: 'Spoken Word' },
];

const uploadSongSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist name is required'),
  category: z.enum(
    [
      'afrobeats',
      'hiphop',
      'pop',
      'rnb',
      'gospel',
      'instrumental',
      'acoustic',
      'worship',
      'spoken',
    ],
    { message: 'Category is required' }
  ),
  lyrics: z
    .string()
    .transform(val => (val.trim() === '' ? undefined : val))
    .optional(),
  description: z
    .string()
    .transform(val => (val.trim() === '' ? undefined : val))
    .optional(),
  tags: z
    .string()
    .transform(val => (val.trim() === '' ? undefined : val))
    .optional(),
  downloadPrice: z
    .string()
    .transform(val => (val.trim() === '' ? undefined : val))
    .optional()
    .refine(
      val => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      'Price must be a valid number greater than or equal to 0'
    ),
});

type FormValues = z.infer<typeof uploadSongSchema>;

const initialFormValues = {
  title: '',
  artist: '',
  category: '' as FormValues['category'] | '',
  lyrics: '',
  description: '',
  tags: '',
  downloadPrice: '',
};

export const UploadSongForm = () => {
  const [formValues, setFormValues] = useState<typeof initialFormValues>(initialFormValues);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const updateFormValue = <K extends keyof typeof initialFormValues>(
    key: K,
    value: (typeof initialFormValues)[K]
  ) => {
    setFormValues(prev => ({ ...prev, [key]: value as FormValues[K] }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioPreview(file.name);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string[]> = {};

    // File validation
    if (!coverFile) newErrors.cover = ['Cover image is required'];
    if (!audioFile) newErrors.audio = ['Audio file is required'];

    // Zod validation - convert empty category string to undefined for validation
    const validationData = {
      ...formValues,
      category:
        formValues.category && formValues.category.trim() !== '' ? formValues.category : undefined,
    };
    const result = uploadSongSchema.safeParse(validationData);
    if (!result.success) {
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as string;
        if (!newErrors[field]) {
          newErrors[field] = [];
        }
        newErrors[field].push(issue.message);
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement actual upload logic
      const data = {
        ...result.data,
        downloadPrice: result?.data?.downloadPrice
          ? parseFloat(result.data.downloadPrice)
          : undefined,
      };
      console.log('Form data:', data);
      console.log('Cover file:', coverFile);
      console.log('Audio file:', audioFile);

      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('Song uploaded successfully!');
      // Reset form
      window.location.reload();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Title */}
      <RegularInput
        label="Song Title"
        required
        value={formValues.title}
        onChange={e => updateFormValue('title', e.target.value)}
        placeholder="Enter song title"
        errors={errors.title}
      />

      {/* Artist */}
      <RegularInput
        label="Artist Name"
        required
        value={formValues.artist}
        onChange={e => updateFormValue('artist', e.target.value)}
        placeholder="Enter artist name"
        errors={errors.artist}
      />

      {/* Category */}
      <RegularSelect
        label="Category/Genre"
        required
        value={formValues.category || ''}
        onSelectChange={value => updateFormValue('category', value as FormValues['category'] | '')}
        options={categoryOptions}
        placeholder="Select category"
        errors={errors.category}
      />

      {/* Cover Image */}
      <div>
        <Label htmlFor="cover">
          Cover Image <span className="text-destructive">*</span>
        </Label>
        {errors.cover && errors.cover.length > 0 && (
          <p className="text-sm text-destructive mt-1">{errors.cover[0]}</p>
        )}
        <div className="mt-1">
          {coverPreview ? (
            <div className="relative w-full max-w-xs">
              <div className="relative aspect-square rounded-lg overflow-hidden border border-border">
                <Image src={coverPreview} alt="Cover preview" fill className="object-cover" />
              </div>
              <RegularBtn
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-2 right-2 bg-background/80"
                onClick={() => {
                  setCoverPreview(null);
                  setCoverFile(null);
                }}>
                <X className="w-4 h-4" />
              </RegularBtn>
            </div>
          ) : (
            <label
              htmlFor="cover"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF (MAX. 5MB)</p>
              </div>
              <input
                id="cover"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleCoverChange}
              />
            </label>
          )}
        </div>
      </div>

      {/* Audio File */}
      <div>
        <Label htmlFor="audio">
          Audio File <span className="text-destructive">*</span>
        </Label>
        {errors.audio && errors.audio.length > 0 && (
          <p className="text-sm text-destructive mt-1">{errors.audio[0]}</p>
        )}
        <div className="mt-1">
          {audioPreview ? (
            <div className="flex items-center gap-2 p-4 border border-border rounded-lg bg-muted/50">
              <FileAudio className="w-5 h-5 text-primary" />
              <span className="flex-1 text-sm">{audioPreview}</span>
              <RegularBtn
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setAudioPreview(null);
                  setAudioFile(null);
                }}>
                <X className="w-4 h-4" />
              </RegularBtn>
            </div>
          ) : (
            <label
              htmlFor="audio"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Music className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> audio file
                </p>
                <p className="text-xs text-muted-foreground">MP3, WAV, M4A (MAX. 50MB)</p>
              </div>
              <input
                id="audio"
                type="file"
                className="hidden"
                accept="audio/*"
                onChange={handleAudioChange}
              />
            </label>
          )}
        </div>
      </div>

      {/* Lyrics */}
      <RegularTextarea
        label="Lyrics (Optional)"
        value={formValues.lyrics ?? ''}
        onChange={e => updateFormValue('lyrics', e.target.value)}
        placeholder="Enter song lyrics..."
        rows={8}
      />

      {/* Description */}
      <RegularTextarea
        label="Description (Optional)"
        value={formValues.description ?? ''}
        onChange={e => updateFormValue('description', e.target.value)}
        placeholder="Tell us about this song..."
        rows={4}
      />

      {/* Tags */}
      <RegularInput
        label="Tags (Optional)"
        value={formValues.tags ?? ''}
        onChange={e => updateFormValue('tags', e.target.value)}
        placeholder="Enter tags separated by commas"
        bottomText="Separate tags with commas (e.g., inspirational, worship, praise)"
      />

      {/* Download Price */}
      <RegularInput
        label="Download Price ($) (Optional)"
        type="number"
        step="0.01"
        min="0"
        value={formValues.downloadPrice ?? ''}
        onChange={e => updateFormValue('downloadPrice', e.target.value)}
        placeholder="0.00 (leave empty for free downloads)"
        errors={errors.downloadPrice}
        bottomText="Leave empty for free downloads. Set a price to monetize downloads."
      />

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <RegularBtn
          type="submit"
          size="full"
          className="flex-1"
          disabled={isSubmitting}
          loading={isSubmitting}
          LeftIcon={Upload}
          leftIconProps={{ className: 'w-5 h-5 mr-2' }}
          text={isSubmitting ? 'Uploading...' : 'Upload Song'}
          onDisabledClick={() => {
            if (isSubmitting) {
              alert('Please wait, uploading your song…');
            }
          }}
        />
        <RegularBtn
          type="button"
          variant="outline"
          size="default"
          linkProps={{ href: '/music' }}
          text="Cancel"
        />
      </div>
    </form>
  );
};
