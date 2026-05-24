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
  IArtistCreateVideoPayload,
  IArtistUpdateVideoPayload,
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

interface ArtistVideoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId: string | null;
  onSuccess: () => void;
}

const defaultForm: IArtistCreateVideoPayload & { videoUrl?: string } = {
  title: '',
  description: '',
  thumbnail: '',
  videoUrl: '',
  videoFileUrl: '',
  embedUrl: '',
  category: '',
  isMonetizable: false,
  price: 0,
};

export function ArtistVideoFormModal({
  open,
  onOpenChange,
  editId,
  onSuccess,
}: ArtistVideoFormModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editStatus, setEditStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [pendingThumbnail, setPendingThumbnail] = useState<File | null>(null);
  const [pendingVideoFile, setPendingVideoFile] = useState<File | null>(null);

  const isEdit = Boolean(editId);
  const { options: rawCategoryOptions, loading: categoriesLoading } = useContentCategoryOptions({
    scope: 'video',
    audience: 'public',
  });

  const categoryOptions = useMemo<SelectOption[]>(
    () => [{ text: 'None', value: '' }, ...rawCategoryOptions],
    [rawCategoryOptions]
  );

  const thumbnailUpload = useFileUpload({
    entityType: 'resource',
    entityId: editId ?? 'artist-video-pending',
    intent: 'image',
  });
  const videoFileUpload = useFileUpload({
    entityType: 'resource',
    entityId: editId ?? 'artist-video-pending',
    intent: 'other',
  });

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setEditStatus('draft');
      return;
    }
    if (!editId) {
      setForm(defaultForm);
      setEditStatus('draft');
      return;
    }

    let cancelled = false;
    setDetailLoading(true);
    void (async () => {
      try {
        const res = await callApi('ARTIST_GET_VIDEO_ITEM', {
          query: `/${editId}` as `/${string}`,
        });
        if (cancelled || res.type !== 'success' || !res.data.video) return;
        const v = res.data.video;
        setForm({
          title: v.title ?? '',
          description: v.description ?? '',
          thumbnail: v.thumbnail ?? '',
          videoUrl: v.videoUrl ?? '',
          videoFileUrl: (v as { videoFileUrl?: string }).videoFileUrl ?? '',
          embedUrl: (v as { embedUrl?: string }).embedUrl ?? '',
          category: v.category ?? '',
          isMonetizable: Boolean(v.isMonetizable),
          price: typeof v.price === 'number' ? v.price : Number(v.price) || 0,
        });
        setEditStatus(normalizeEnumValue(v.status, PUBLISHABLE_STATUS_VALUES, 'draft'));
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
      const thumbnail = normalizeOptionalHttpUrl(form.thumbnail ?? '', 'Thumbnail URL');
      const videoFileUrl = normalizeOptionalHttpUrl(form.videoFileUrl ?? '', 'Video file URL');
      const embedUrl = normalizeOptionalHttpUrl(form.embedUrl ?? '', 'Embed URL');
      const category = normalizeOptionalText(form.category ?? '');
      const videoUrl = normalizeOptionalHttpUrl(form.videoUrl ?? '', 'Video URL');

      assertMonetizationPriceClient(form.isMonetizable, form.price);
      const isMonetizable = Boolean(form.isMonetizable);
      const price = resolveMonetizationFormPrice(isMonetizable, form.price);

      let finalThumbnail = thumbnail;
      let finalVideoFileUrl = videoFileUrl;
      const finalVideoUrl = videoUrl;

      if (editId) {
        if (pendingThumbnail) {
          const upload = await thumbnailUpload.uploadFile({
            file: pendingThumbnail,
            entityId: editId,
          });
          if (!upload?.url) throw new Error('Thumbnail upload failed');
          finalThumbnail = upload.url;
        }
        if (pendingVideoFile) {
          const upload = await videoFileUpload.uploadFile({
            file: pendingVideoFile,
            entityId: editId,
          });
          if (!upload?.url) throw new Error('Video file upload failed');
          finalVideoFileUrl = upload.url;
        }

        const payload: IArtistUpdateVideoPayload = {
          title,
          description: description || undefined,
          thumbnail: finalThumbnail,
          videoFileUrl: finalVideoFileUrl,
          embedUrl,
          videoUrl: finalVideoUrl,
          category,
          isMonetizable,
          price,
          status: editStatus,
        };

        const res = await callApi('ARTIST_UPDATE_VIDEO', {
          query: `/${editId}` as `/${string}`,
          payload,
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        const payload: IArtistCreateVideoPayload = {
          title,
          description,
          thumbnail: finalThumbnail || '',
          videoFileUrl: finalVideoFileUrl || '',
          embedUrl,
          category,
          isMonetizable,
          price,
        };

        const res = await callApi('ARTIST_CREATE_VIDEO', { payload });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');

        const createdId =
          (res.data as { video?: { _id?: string } } | undefined)?.video?._id ??
          (res.data as { _id?: string } | undefined)?._id;

        if (createdId && (pendingThumbnail || pendingVideoFile)) {
          if (pendingThumbnail) {
            const upload = await thumbnailUpload.uploadFile({
              file: pendingThumbnail,
              entityId: createdId,
            });
            if (upload?.url) finalThumbnail = upload.url;
          }
          if (pendingVideoFile) {
            const upload = await videoFileUpload.uploadFile({
              file: pendingVideoFile,
              entityId: createdId,
            });
            if (upload?.url) finalVideoFileUrl = upload.url;
          }

          const patchRes = await callApi('ARTIST_UPDATE_VIDEO', {
            query: `/${createdId}` as `/${string}`,
            payload: {
              thumbnail: finalThumbnail,
              videoFileUrl: finalVideoFileUrl,
            },
          });
          if (patchRes.type !== 'success') {
            throw new Error(patchRes.error?.message ?? 'Post-create media update failed');
          }
        }
      }

      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
      toast.success(isEdit ? 'Video updated.' : 'Video saved as draft.');
    } catch (err) {
      console.error(isEdit ? 'Update video failed:' : 'Create video failed:', err);
      toast.error(err instanceof Error ? err.message : 'Unable to save video.');
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
          <DialogTitle>{isEdit ? 'Edit video' : 'Add video'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update your video. Use a hosted file or YouTube embed URL.'
              : 'New videos are saved as drafts. Admins may publish after review.'}
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
              placeholder="Video title"
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
            <MediaUrlOrUploadField
              label="Thumbnail"
              value={form.thumbnail ?? ''}
              onChange={value => setForm(f => ({ ...f, thumbnail: value }))}
              entityType="resource"
              entityId={editId}
              fallbackEntityIdPrefix="artist-video-thumb"
              intent="image"
              accept="image/*"
              defaultMode="upload"
              onPendingFileChange={setPendingThumbnail}
            />
            <MediaUrlOrUploadField
              label="Video file"
              value={form.videoFileUrl ?? ''}
              onChange={value => setForm(f => ({ ...f, videoFileUrl: value }))}
              entityType="resource"
              entityId={editId}
              fallbackEntityIdPrefix="artist-video-file"
              intent="other"
              accept="video/*"
              onPendingFileChange={setPendingVideoFile}
            />
            <RegularInput
              label="Embed URL (YouTube / Vimeo)"
              value={form.embedUrl ?? ''}
              onChange={e => setForm(f => ({ ...f, embedUrl: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <MonetizationFormFields
              idPrefix="artist-video"
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
