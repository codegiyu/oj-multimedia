'use client';

import { useState } from 'react';
import { Upload, Music, Image as ImageIcon, FileAudio, X, Drum } from 'lucide-react';
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

const keyOptions: SelectOption[] = [
  { value: 'C', text: 'C' },
  { value: 'C#', text: 'C#' },
  { value: 'D', text: 'D' },
  { value: 'D#', text: 'D#' },
  { value: 'E', text: 'E' },
  { value: 'F', text: 'F' },
  { value: 'F#', text: 'F#' },
  { value: 'G', text: 'G' },
  { value: 'G#', text: 'G#' },
  { value: 'A', text: 'A' },
  { value: 'A#', text: 'A#' },
  { value: 'B', text: 'B' },
];

const submitBeatsSchema = z.object({
  title: z.string().min(1, 'Beat title is required'),
  producer: z.string().min(1, 'Producer name is required'),
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
  bpm: z
    .string()
    .transform(val => (val.trim() === '' ? undefined : val))
    .optional()
    .refine(
      val => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 60 && parseInt(val) <= 200),
      'BPM must be between 60 and 200'
    ),
  key: z.enum(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']).optional(),
  description: z
    .string()
    .transform(val => (val.trim() === '' ? undefined : val))
    .optional(),
  tags: z
    .string()
    .transform(val => (val.trim() === '' ? undefined : val))
    .optional(),
  pricing: z
    .string()
    .transform(val => (val.trim() === '' ? undefined : val))
    .optional(),
});

type FormValues = z.infer<typeof submitBeatsSchema>;

const initialFormValues = {
  title: '',
  producer: '',
  category: '' as FormValues['category'] | '',
  bpm: '',
  key: undefined as FormValues['key'],
  description: '',
  tags: '',
  pricing: '',
};

export const SubmitBeatsForm = () => {
  const [formValues, setFormValues] = useState<typeof initialFormValues>(initialFormValues);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [beatPreview, setBeatPreview] = useState<string | null>(null);
  const [instrumentalPreview, setInstrumentalPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [beatFile, setBeatFile] = useState<File | null>(null);
  const [instrumentalFile, setInstrumentalFile] = useState<File | null>(null);
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

  const handleBeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBeatFile(file);
      setBeatPreview(file.name);
    }
  };

  const handleInstrumentalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInstrumentalFile(file);
      setInstrumentalPreview(file.name);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string[]> = {};

    // File validation
    if (!coverFile) newErrors.cover = ['Cover image is required'];
    if (!beatFile) newErrors.beat = ['Beat audio file is required'];

    // Zod validation - convert empty category string to undefined for validation
    const validationData = {
      ...formValues,
      category:
        formValues.category && formValues.category.trim() !== '' ? formValues.category : undefined,
    };
    const result = submitBeatsSchema.safeParse(validationData);
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
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('Beat submitted successfully!');
      // Reset form
      window.location.reload();
    } catch {
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Beat Title */}
      <RegularInput
        label="Beat Title"
        required
        value={formValues.title}
        onChange={e => updateFormValue('title', e.target.value)}
        placeholder="Enter beat title"
        errors={errors.title}
      />

      {/* Producer Name */}
      <RegularInput
        label="Producer Name"
        required
        value={formValues.producer}
        onChange={e => updateFormValue('producer', e.target.value)}
        placeholder="Enter producer name"
        errors={errors.producer}
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

      {/* Beat Audio File */}
      <div>
        <Label htmlFor="beat">
          Beat Audio File <span className="text-destructive">*</span>
        </Label>
        {errors.beat && errors.beat.length > 0 && (
          <p className="text-sm text-destructive mt-1">{errors.beat[0]}</p>
        )}
        <div className="mt-1">
          {beatPreview ? (
            <div className="flex items-center gap-2 p-4 border border-border rounded-lg bg-muted/50">
              <FileAudio className="w-5 h-5 text-primary" />
              <span className="flex-1 text-sm">{beatPreview}</span>
              <RegularBtn
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setBeatPreview(null);
                  setBeatFile(null);
                }}>
                <X className="w-4 h-4" />
              </RegularBtn>
            </div>
          ) : (
            <label
              htmlFor="beat"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Drum className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> beat file
                </p>
                <p className="text-xs text-muted-foreground">MP3, WAV, M4A (MAX. 50MB)</p>
              </div>
              <input
                id="beat"
                type="file"
                className="hidden"
                accept="audio/*"
                onChange={handleBeatChange}
              />
            </label>
          )}
        </div>
      </div>

      {/* Instrumental Version (Optional) */}
      <div>
        <Label htmlFor="instrumental">Instrumental Version (Optional)</Label>
        <div className="mt-1">
          {instrumentalPreview ? (
            <div className="flex items-center gap-2 p-4 border border-border rounded-lg bg-muted/50">
              <FileAudio className="w-5 h-5 text-primary" />
              <span className="flex-1 text-sm">{instrumentalPreview}</span>
              <RegularBtn
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setInstrumentalPreview(null);
                  setInstrumentalFile(null);
                }}>
                <X className="w-4 h-4" />
              </RegularBtn>
            </div>
          ) : (
            <label
              htmlFor="instrumental"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Music className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> instrumental version
                </p>
                <p className="text-xs text-muted-foreground">MP3, WAV, M4A (MAX. 50MB)</p>
              </div>
              <input
                id="instrumental"
                type="file"
                className="hidden"
                accept="audio/*"
                onChange={handleInstrumentalChange}
              />
            </label>
          )}
        </div>
      </div>

      {/* BPM */}
      <RegularInput
        label="BPM (Optional)"
        type="number"
        min="60"
        max="200"
        value={formValues.bpm ?? ''}
        onChange={e => updateFormValue('bpm', e.target.value)}
        placeholder="e.g., 120"
      />

      {/* Key */}
      <RegularSelect
        label="Key (Optional)"
        value={formValues.key || ''}
        onSelectChange={value => updateFormValue('key', value as FormValues['key'])}
        options={keyOptions}
        placeholder="Select key"
      />

      {/* Description */}
      <RegularTextarea
        label="Description (Optional)"
        value={formValues.description ?? ''}
        onChange={e => updateFormValue('description', e.target.value)}
        placeholder="Tell us about this beat..."
        rows={4}
      />

      {/* Tags */}
      <RegularInput
        label="Tags (Optional)"
        value={formValues.tags ?? ''}
        onChange={e => updateFormValue('tags', e.target.value)}
        placeholder="Enter tags separated by commas"
        bottomText="Separate tags with commas (e.g., trap, 808, dark)"
      />

      {/* Pricing */}
      <RegularTextarea
        label="Pricing Information (Optional)"
        value={formValues.pricing ?? ''}
        onChange={e => updateFormValue('pricing', e.target.value)}
        placeholder="Enter pricing details (e.g., $50 for exclusive rights, $20 for lease)"
        rows={3}
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
          text={isSubmitting ? 'Submitting...' : 'Submit Beat'}
          onDisabledClick={() => {
            if (isSubmitting) {
              // Keep using alert-style feedback here to avoid extra dependencies
              alert('Please wait, submitting your beat…');
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
