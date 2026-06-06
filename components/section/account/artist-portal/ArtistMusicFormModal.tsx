'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import type { SelectOption } from '@/lib/types/general';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import type {
  IArtistCreateMusicPayload,
  IArtistUpdateMusicPayload,
} from '@/lib/constants/endpoints';
import { MediaUrlOrUploadField } from '@/components/general/MediaUrlOrUploadField';
import { ensureSelectContainsSlug } from '@/lib/utils/adminContentCategorySelect';
import {
  assertMonetizationPriceClient,
  normalizeEnumValue,
  normalizeOptionalHttpUrl,
  normalizeOptionalText,
  requireText,
  resolveMonetizationFormPrice,
} from '@/lib/utils/adminFormValidation';
import { MonetizationFormFields } from '@/components/section/admin/shared/MonetizationFormFields';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import { useContentCategoryOptions } from '@/lib/hooks/useContentCategoryOptions';
import {
  PUBLISHABLE_STATUS_SELECT_OPTIONS,
  PUBLISHABLE_STATUS_VALUES,
} from '@/lib/constants/adminSelectOptions';
import { MediaMetadataFields } from '@/components/section/admin/shared/MediaMetadataFields';
import {
  buildDurationMetadataPayload,
  durationSecondsToParts,
  EMPTY_MEDIA_DURATION_PARTS,
  validateMediaDurationParts,
  type MediaDurationParts,
} from '@/lib/utils/mediaMetadataForm';

interface ArtistMusicFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId: string | null;
  onSuccess: () => void;
}

const defaultForm: IArtistCreateMusicPayload & { videoUrl?: string } = {
  title: '',
  description: '',
  lyrics: '',
  category: '',
  coverImage: '',
  audioUrl: '',
  videoUrl: '',
  isMonetizable: false,
  price: 0,
};

export function ArtistMusicFormModal({
  open,
  onOpenChange,
  editId,
  onSuccess,
}: ArtistMusicFormModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editStatus, setEditStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [pendingCover, setPendingCover] = useState<File | null>(null);
  const [pendingAudio, setPendingAudio] = useState<File | null>(null);
  const [durationParts, setDurationParts] = useState<MediaDurationParts>(
    EMPTY_MEDIA_DURATION_PARTS
  );

  const isEdit = Boolean(editId);
  const { options: rawCategoryOptions, loading: categoriesLoading } = useContentCategoryOptions({
    scope: 'music',
    audience: 'public',
  });

  const categoryOptions = useMemo<SelectOption[]>(
    () => [{ text: 'None', value: '' }, ...rawCategoryOptions],
    [rawCategoryOptions]
  );

  const coverUpload = useFileUpload({
    entityType: 'music',
    entityId: editId ?? 'artist-music-pending',
    intent: 'image',
  });
  const audioUpload = useFileUpload({
    entityType: 'music',
    entityId: editId ?? 'artist-music-pending',
    intent: 'other',
  });

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setEditStatus('draft');
      setDurationParts(EMPTY_MEDIA_DURATION_PARTS);
      return;
    }
    if (!editId) {
      setForm(defaultForm);
      setEditStatus('draft');
      setDurationParts(EMPTY_MEDIA_DURATION_PARTS);
      return;
    }

    let cancelled = false;
    setDetailLoading(true);
    void (async () => {
      try {
        const res = await callApi('ARTIST_GET_MUSIC_ITEM', {
          query: `/${editId}` as `/${string}`,
        });
        if (cancelled || res.type !== 'success' || !res.data.music) return;
        const m = res.data.music;
        setForm({
          title: m.title ?? '',
          description: m.description ?? '',
          lyrics: m.lyrics ?? '',
          category: m.category ?? '',
          coverImage: m.coverImage ?? '',
          audioUrl: m.audioUrl ?? '',
          videoUrl: m.videoUrl ?? '',
          isMonetizable: Boolean(m.isMonetizable),
          price: typeof m.price === 'number' ? m.price : Number(m.price) || 0,
        });
        setEditStatus(normalizeEnumValue(m.status, PUBLISHABLE_STATUS_VALUES, 'draft'));
        setDurationParts(
          durationSecondsToParts(
            (m as { metadata?: { durationSeconds?: number } }).metadata?.durationSeconds
          )
        );
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, editId]);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const title = requireText(form.title, 'Title');
      const description = normalizeOptionalText(form.description ?? '');
      const lyrics = normalizeOptionalText(form.lyrics ?? '');
      const category = normalizeOptionalText(form.category ?? '');
      const coverImage = normalizeOptionalHttpUrl(form.coverImage ?? '', 'Cover image URL');
      const audioUrl = normalizeOptionalHttpUrl(form.audioUrl ?? '', 'Audio URL');
      const videoUrl = normalizeOptionalHttpUrl(form.videoUrl ?? '', 'Video URL');

      assertMonetizationPriceClient(form.isMonetizable, form.price);
      const durationError = validateMediaDurationParts(durationParts);
      if (durationError) throw new Error(durationError);
      const metadataPayload = buildDurationMetadataPayload(durationParts);
      const isMonetizable = Boolean(form.isMonetizable);
      const price = resolveMonetizationFormPrice(isMonetizable, form.price);

      let finalCoverImage = coverImage;
      let finalAudioUrl = audioUrl;
      const finalVideoUrl = videoUrl;

      if (editId) {
        if (pendingCover) {
          const upload = await coverUpload.uploadFile({ file: pendingCover, entityId: editId });
          if (!upload?.url) throw new Error('Cover upload failed');
          finalCoverImage = upload.url;
        }
        if (pendingAudio) {
          const upload = await audioUpload.uploadFile({ file: pendingAudio, entityId: editId });
          if (!upload?.url) throw new Error('Audio upload failed');
          finalAudioUrl = upload.url;
        }

        const payload: IArtistUpdateMusicPayload = {
          title,
          description: description || undefined,
          lyrics: lyrics || undefined,
          category,
          coverImage: finalCoverImage,
          audioUrl: finalAudioUrl,
          videoUrl: finalVideoUrl,
          isMonetizable,
          price,
          status: editStatus,
          ...metadataPayload,
        };

        const res = await callApi('ARTIST_UPDATE_MUSIC', {
          query: `/${editId}` as `/${string}`,
          payload,
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        const payload: IArtistCreateMusicPayload = {
          title,
          description,
          lyrics,
          category,
          coverImage: finalCoverImage || undefined,
          audioUrl: finalAudioUrl || undefined,
          videoUrl: finalVideoUrl || undefined,
          isMonetizable,
          price,
          ...metadataPayload,
        };

        const res = await callApi('ARTIST_CREATE_MUSIC', { payload });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');

        const createdId =
          (res.data as { music?: { _id?: string } } | undefined)?.music?._id ??
          (res.data as { _id?: string } | undefined)?._id;

        if (createdId && (pendingCover || pendingAudio || metadataPayload.metadata)) {
          if (pendingCover) {
            const upload = await coverUpload.uploadFile({
              file: pendingCover,
              entityId: createdId,
            });
            if (upload?.url) finalCoverImage = upload.url;
          }
          if (pendingAudio) {
            const upload = await audioUpload.uploadFile({
              file: pendingAudio,
              entityId: createdId,
            });
            if (upload?.url) finalAudioUrl = upload.url;
          }

          const patchRes = await callApi('ARTIST_UPDATE_MUSIC', {
            query: `/${createdId}` as `/${string}`,
            payload: {
              coverImage: finalCoverImage,
              audioUrl: finalAudioUrl,
              ...metadataPayload,
            },
          });
          if (patchRes.type !== 'success') {
            throw new Error(patchRes.error?.message ?? 'Post-create media update failed');
          }
        }
      }

      setForm(defaultForm);
      setDurationParts(EMPTY_MEDIA_DURATION_PARTS);
      onOpenChange(false);
      onSuccess();
      toast.success(isEdit ? 'Track updated.' : 'Track saved as draft.');
    } catch (err) {
      console.error(isEdit ? 'Update music failed:' : 'Create music failed:', err);
      toast.error(err instanceof Error ? err.message : 'Unable to save track.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) setForm(defaultForm);
    onOpenChange(val);
  };

  const categorySelectOptions = ensureSelectContainsSlug(categoryOptions, form.category);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit track' : 'Add track'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update your track. Published items stay live after admin review when required.'
              : 'New tracks are saved as drafts. Admins may publish after review.'}
          </DialogDescription>
        </DialogHeader>
        {detailLoading ? (
          <p className="text-sm text-muted-foreground py-4">Loading…</p>
        ) : (
          <form onSubmit={e => void handleSubmit(e)} className="grid gap-4">
            <RegularInput
              label="Title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Track title"
              required
            />
            {isEdit && (
              <RegularSelect
                label="Status"
                value={editStatus}
                onSelectChange={v =>
                  setEditStatus(normalizeEnumValue(v, PUBLISHABLE_STATUS_VALUES, 'draft'))
                }
                options={[...PUBLISHABLE_STATUS_SELECT_OPTIONS] as SelectOption[]}
              />
            )}
            <RegularSelect
              label="Category"
              value={form.category ?? ''}
              onSelectChange={v => setForm(f => ({ ...f, category: v }))}
              options={categorySelectOptions}
              loading={categoriesLoading}
            />
            <RegularTextarea
              label="Description"
              value={form.description ?? ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Optional description"
              rows={3}
            />
            <RegularTextarea
              label="Lyrics"
              value={form.lyrics ?? ''}
              onChange={e => setForm(f => ({ ...f, lyrics: e.target.value }))}
              placeholder="Optional lyrics"
              rows={4}
            />
            <MediaUrlOrUploadField
              label="Cover image"
              value={form.coverImage ?? ''}
              onChange={value => setForm(f => ({ ...f, coverImage: value }))}
              entityType="music"
              entityId={editId}
              fallbackEntityIdPrefix="artist-music-cover"
              intent="image"
              accept="image/*"
              defaultMode="upload"
              onPendingFileChange={setPendingCover}
            />
            <MediaUrlOrUploadField
              label="Audio file"
              value={form.audioUrl ?? ''}
              onChange={value => setForm(f => ({ ...f, audioUrl: value }))}
              entityType="music"
              entityId={editId}
              fallbackEntityIdPrefix="artist-music-audio"
              intent="other"
              accept="audio/*"
              onPendingFileChange={setPendingAudio}
            />
            <MediaMetadataFields
              idPrefix="artist-music"
              value={durationParts}
              onChange={setDurationParts}
              disabled={loading}
            />
            <MonetizationFormFields
              idPrefix="artist-music"
              isMonetizable={Boolean(form.isMonetizable)}
              price={form.price ?? 0}
              onMonetizableChange={value =>
                setForm(f => ({
                  ...f,
                  isMonetizable: value,
                  ...(value ? {} : { price: 0 }),
                }))
              }
              onPriceChange={value => setForm(f => ({ ...f, price: value }))}
              disabled={loading}
            />
            <DialogFooter>
              <RegularBtn
                type="button"
                text="Cancel"
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              />
              <RegularBtn
                type="submit"
                text={isEdit ? 'Save changes' : 'Save draft'}
                loading={loading}
                disabled={!form.title.trim()}
              />
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
