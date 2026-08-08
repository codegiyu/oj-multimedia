'use client';

import { useState, useEffect } from 'react';
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
  IAdminCreateVideoPayload,
  IAdminUpdateVideoPayload,
  ArtistVideoListItem,
} from '@/lib/constants/endpoints';
import { AdminUserAccountPicker } from '@/components/section/admin/shared/AdminUserAccountPicker';
import { MediaUrlOrUploadField } from '@/components/general/MediaUrlOrUploadField';
import {
  ensureSelectContainsSlug,
  loadAdminContentCategorySelectOptions,
} from '@/lib/utils/adminContentCategorySelect';
import {
  assertMonetizationPriceClient,
  normalizeEnumValue,
  normalizeOptionalHttpUrl,
  normalizeOptionalText,
  requireText,
  resolveMonetizationFormPrice,
} from '@/lib/utils/adminFormValidation';
import {
  assertOptionalYoutubeEmbedUrl,
  assertVideoHasPlayableMedia,
  resolveVideoMediaFields,
  youtubeEmbedUrlFromInput,
} from '@/lib/utils/videoEmbed';
import { resolveDeferredCreateStatus } from '@/lib/utils/adminVideoCreateOrder';
import { MonetizationFormFields } from '@/components/section/admin/shared/MonetizationFormFields';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import {
  PUBLISHABLE_STATUS_SELECT_OPTIONS,
  PUBLISHABLE_STATUS_VALUES,
} from '@/lib/constants/adminSelectOptions';
import { parseCommaSeparatedTags, formatTagsForInput } from '@/lib/utils/adminCommaTags';
import { MediaMetadataFields } from '@/components/section/admin/shared/MediaMetadataFields';
import {
  buildDurationMetadataPayload,
  durationSecondsToParts,
  EMPTY_MEDIA_DURATION_PARTS,
  validateMediaDurationParts,
  type MediaDurationParts,
} from '@/lib/utils/mediaMetadataForm';
import { AUDIO_UPLOAD_MAX_BYTES, formatUploadBytes } from '@/lib/constants/uploadLimits';

interface CreateVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId: string | null;
  onSuccess: () => void;
}

const defaultForm: Omit<IArtistCreateVideoPayload, 'tags'> & {
  artistId: string;
  ownerUserId: string;
  tags: string;
} = {
  title: '',
  description: '',
  thumbnail: '',
  videoUrl: '',
  videoFileUrl: '',
  embedUrl: '',
  category: '',
  tags: '',
  isMonetizable: false,
  price: 0,
  artistId: '',
  ownerUserId: '',
};

function artistName(artist: ArtistVideoListItem['artist']): string {
  if (!artist) return '—';
  return typeof artist === 'string' ? artist : ((artist as { name?: string }).name ?? '—');
}

export function CreateVideoModal({ open, onOpenChange, editId, onSuccess }: CreateVideoModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [artistOptions, setArtistOptions] = useState<SelectOption[]>([]);
  const [artistsLoading, setArtistsLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([
    { text: 'None', value: '' },
  ]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [editStatus, setEditStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [assignOwnerUserId, setAssignOwnerUserId] = useState('');
  const [ownerMeta, setOwnerMeta] = useState<{
    ownerLocked: boolean;
    ownerUserId: string;
    hasArtist: boolean;
  }>({ ownerLocked: false, ownerUserId: '', hasArtist: false });
  const [editListRow, setEditListRow] = useState<ArtistVideoListItem | null>(null);
  const [pendingThumbnail, setPendingThumbnail] = useState<File | null>(null);
  const [pendingVideoFile, setPendingVideoFile] = useState<File | null>(null);
  const [durationParts, setDurationParts] = useState<MediaDurationParts>(
    EMPTY_MEDIA_DURATION_PARTS
  );

  const isEdit = Boolean(editId);
  const canPublish = Boolean((form.category ?? '').trim());
  const thumbnailUpload = useFileUpload({
    entityType: 'resource',
    entityId: editId ?? 'video-pending',
    intent: 'image',
  });
  const videoFileUpload = useFileUpload({
    entityType: 'resource',
    entityId: editId ?? 'video-pending',
    intent: 'other',
  });

  useEffect(() => {
    if (!open || isEdit) return;
    setArtistsLoading(true);
    void callApi('ADMIN_ARTISTS_LIST', { query: '?limit=500' })
      .then(res => {
        if (res.type !== 'success') return;
        const artists = res.data.artists ?? [];
        setArtistOptions([
          { text: 'No artist profile (optional)', value: '' },
          ...artists.map(a => ({ text: a.name, value: a._id })),
        ]);
      })
      .finally(() => setArtistsLoading(false));
  }, [open, isEdit]);

  useEffect(() => {
    if (!open) return;
    setCategoriesLoading(true);
    void loadAdminContentCategorySelectOptions('video')
      .then(opts => setCategoryOptions(opts))
      .finally(() => setCategoriesLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setEditStatus('draft');
      setAssignOwnerUserId('');
      setOwnerMeta({ ownerLocked: false, ownerUserId: '', hasArtist: false });
      setEditListRow(null);
      setDurationParts(EMPTY_MEDIA_DURATION_PARTS);
      setPendingThumbnail(null);
      setPendingVideoFile(null);
      return;
    }
    if (!editId) {
      setForm(defaultForm);
      setEditStatus('draft');
      setAssignOwnerUserId('');
      setOwnerMeta({ ownerLocked: false, ownerUserId: '', hasArtist: false });
      setEditListRow(null);
      setDurationParts(EMPTY_MEDIA_DURATION_PARTS);
      setPendingThumbnail(null);
      setPendingVideoFile(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    void (async () => {
      try {
        const res = await callApi('ADMIN_VIDEO_ITEM', {
          query: `/${editId}` as `/${string}`,
        });
        if (cancelled || res.type !== 'success' || !res.data.video) return;
        const v = res.data.video;
        setEditListRow(v);
        setCategoryOptions(prev => ensureSelectContainsSlug(prev, v.category ?? undefined));
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
          artistId: '',
          ownerUserId: '',
          tags: formatTagsForInput((v as { tags?: string[] }).tags),
        });
        setEditStatus(normalizeEnumValue(v.status, PUBLISHABLE_STATUS_VALUES, 'draft'));
        const hasArtist = Boolean(v.artist);
        setOwnerMeta({
          ownerLocked: Boolean(v.ownerLocked ?? hasArtist),
          ownerUserId: v.ownerUserId ?? '',
          hasArtist,
        });
        setAssignOwnerUserId('');
        setDurationParts(
          durationSecondsToParts(
            (v as { metadata?: { durationSeconds?: number } }).metadata?.durationSeconds
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

  const handleSubmit = async (
    e?: React.FormEvent<HTMLFormElement>,
    createStatus: 'draft' | 'published' = 'draft'
  ) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const title = requireText(form.title, 'Title');
      const description = normalizeOptionalText(form.description ?? '');
      const thumbnail = normalizeOptionalHttpUrl(form.thumbnail ?? '', 'Thumbnail URL');
      const videoUrl = normalizeOptionalHttpUrl(form.videoUrl ?? '', 'Legacy video URL');
      const videoFileUrlRaw = normalizeOptionalHttpUrl(form.videoFileUrl ?? '', 'Video file URL');
      const embedUrlRaw = normalizeOptionalHttpUrl(form.embedUrl ?? '', 'Embed URL');
      const category = form.category ?? '';
      const tags = parseCommaSeparatedTags(form.tags);

      const resolvedMedia = resolveVideoMediaFields({
        videoFileUrl: videoFileUrlRaw,
        embedUrl: embedUrlRaw,
        videoUrl,
      });
      const embedUrl = assertOptionalYoutubeEmbedUrl(resolvedMedia.embedUrl, 'Embed URL');
      let finalVideoFileUrl = resolvedMedia.videoFileUrl;
      const finalVideoUrl = resolvedMedia.videoUrl;

      if (resolvedMedia.movedYoutubeFromFile) {
        toast.message('YouTube link moved to Embed URL', {
          description: 'Hosted file uploads belong in Video file URL; YouTube links use Embed URL.',
        });
        setForm(f => ({
          ...f,
          videoFileUrl: '',
          embedUrl,
        }));
      }

      assertMonetizationPriceClient(form.isMonetizable, form.price);
      const durationError = validateMediaDurationParts(durationParts);
      if (durationError) throw new Error(durationError);
      const metadataPayload = buildDurationMetadataPayload(durationParts);
      const isMonetizable = Boolean(form.isMonetizable);
      const price = resolveMonetizationFormPrice(isMonetizable, form.price);

      let finalThumbnail = thumbnail;

      const publishing =
        (isEdit && editStatus === 'published') || (!isEdit && createStatus === 'published');

      assertVideoHasPlayableMedia({
        videoFileUrl: finalVideoFileUrl,
        embedUrl,
        pendingVideoFile: Boolean(pendingVideoFile),
        requireForPublish: publishing,
      });

      if (editId) {
        if (pendingThumbnail) {
          const upload = await thumbnailUpload.uploadFile({
            file: pendingThumbnail,
            entityId: editId,
          });
          if (!upload?.url) {
            throw new Error(
              'Thumbnail upload failed. Check file size (images max 10MB) and try again.'
            );
          }
          finalThumbnail = upload.url;
        }
        if (pendingVideoFile) {
          const upload = await videoFileUpload.uploadFile({
            file: pendingVideoFile,
            entityId: editId,
          });
          if (!upload?.url) {
            throw new Error(
              `Video file upload failed. Max size ${formatUploadBytes(AUDIO_UPLOAD_MAX_BYTES)}; confirm storage is available and retry.`
            );
          }
          finalVideoFileUrl = upload.url;
        }
        const payload: IAdminUpdateVideoPayload = {
          title,
          description: description || undefined,
          thumbnail: finalThumbnail,
          videoUrl: finalVideoUrl,
          videoFileUrl: finalVideoFileUrl,
          embedUrl,
          category,
          tags,
          ...metadataPayload,
          isMonetizable,
          price,
          status: editStatus,
        };
        const canAssignOwner = !ownerMeta.ownerLocked && !ownerMeta.hasArtist;
        if (canAssignOwner && assignOwnerUserId) {
          payload.ownerUserId = assignOwnerUserId;
        }
        const res = await callApi('ADMIN_VIDEO_UPDATE', {
          query: `/${editId}` as `/${string}`,
          payload,
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        const { createStatus: initialStatus, publishAfterMedia } = resolveDeferredCreateStatus({
          requestedStatus: createStatus,
          hasPendingMediaUpload: Boolean(pendingVideoFile || pendingThumbnail),
        });

        const payload: IAdminCreateVideoPayload = {
          title,
          description,
          thumbnail: finalThumbnail || '',
          videoUrl: finalVideoUrl || '',
          videoFileUrl: finalVideoFileUrl || '',
          embedUrl,
          category,
          tags,
          ...metadataPayload,
          isMonetizable,
          price,
          status: initialStatus,
        };
        if (form.artistId) payload.artistId = form.artistId;
        if (form.ownerUserId) payload.ownerUserId = form.ownerUserId;
        const res = await callApi('ADMIN_VIDEO_CREATE', { payload });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');
        const createdId =
          (res.data as { video?: { _id?: string }; _id?: string } | undefined)?.video?._id ??
          (res.data as { _id?: string } | undefined)?._id;

        const needsMediaAttach = Boolean(pendingThumbnail || pendingVideoFile);
        if (needsMediaAttach && !createdId) {
          throw new Error('Video created but id was missing; cannot attach media.');
        }

        if (createdId) {
          if (pendingThumbnail) {
            const upload = await thumbnailUpload.uploadFile({
              file: pendingThumbnail,
              entityId: createdId,
            });
            if (!upload?.url) {
              throw new Error(
                'Thumbnail upload failed after create. A draft may exist — open edit and retry. Check file size (images max 10MB).'
              );
            }
            finalThumbnail = upload.url;
          }
          if (pendingVideoFile) {
            const upload = await videoFileUpload.uploadFile({
              file: pendingVideoFile,
              entityId: createdId,
            });
            if (!upload?.url) {
              throw new Error(
                `Video file upload failed after create. A draft may exist — open edit and retry. Max size ${formatUploadBytes(AUDIO_UPLOAD_MAX_BYTES)}.`
              );
            }
            finalVideoFileUrl = upload.url;
          }
          if (
            pendingThumbnail ||
            pendingVideoFile ||
            metadataPayload.metadata ||
            publishAfterMedia
          ) {
            const patchPayload: IAdminUpdateVideoPayload = {
              thumbnail: finalThumbnail,
              videoFileUrl: finalVideoFileUrl,
              embedUrl,
              ...metadataPayload,
            };
            if (publishAfterMedia) patchPayload.status = 'published';

            const patchRes = await callApi('ADMIN_VIDEO_UPDATE', {
              query: `/${createdId}` as `/${string}`,
              payload: patchPayload,
            });
            if (patchRes.type !== 'success')
              throw new Error(
                patchRes.error?.message ??
                  'Post-create media update failed. A draft may exist — open edit and retry.'
              );
          }
        }
      }
      setForm(defaultForm);
      setDurationParts(EMPTY_MEDIA_DURATION_PARTS);
      setPendingThumbnail(null);
      setPendingVideoFile(null);
      onOpenChange(false);
      onSuccess();
      toast.success(isEdit ? 'Video updated.' : 'Video created.');
    } catch (err) {
      console.error(isEdit ? 'Update video failed:' : 'Create video failed:', err);
      toast.error(err instanceof Error ? err.message : 'Unable to save video.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setForm(defaultForm);
      setDurationParts(EMPTY_MEDIA_DURATION_PARTS);
      setPendingThumbnail(null);
      setPendingVideoFile(null);
    }
    onOpenChange(val);
  };

  const categorySelectOptions = ensureSelectContainsSlug(categoryOptions, form.category);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit video' : 'Create video'}</DialogTitle>
          <DialogDescription>{isEdit ? 'Update this video' : 'Add a new video'}</DialogDescription>
        </DialogHeader>
        {detailLoading ? (
          <p className="text-sm text-muted-foreground py-4">Loading…</p>
        ) : (
          <form onSubmit={e => void handleSubmit(e)} className="grid gap-4">
            {!isEdit && (
              <>
                <RegularSelect
                  label="Artist profile (optional)"
                  value={form.artistId}
                  onSelectChange={v => setForm(f => ({ ...f, artistId: v }))}
                  options={artistOptions}
                  loading={artistsLoading}
                />
                <AdminUserAccountPicker
                  value={form.ownerUserId}
                  onChange={(userId, _u) =>
                    setForm(f => ({
                      ...f,
                      ownerUserId: userId,
                      ...(userId ? { artistId: '' } : {}),
                    }))
                  }
                />
              </>
            )}
            <RegularInput
              label="Title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Enter title"
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
              subtext="Required when publishing."
            />
            <RegularInput
              label="Tags"
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="e.g. sermon, worship, documentary"
              bottomText="Separate tags with commas"
            />
            <RegularTextarea
              label="Description"
              value={form.description ?? ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Enter description"
              rows={3}
            />
            <MediaUrlOrUploadField
              label="Thumbnail URL"
              value={form.thumbnail ?? ''}
              onChange={value => setForm(f => ({ ...f, thumbnail: value }))}
              entityType="resource"
              entityId={editId}
              fallbackEntityIdPrefix="video-thumbnail"
              intent="image"
              accept="image/*"
              defaultMode="upload"
              onPendingFileChange={setPendingThumbnail}
            />
            <MediaUrlOrUploadField
              label="Video file URL"
              value={form.videoFileUrl ?? ''}
              onChange={value => {
                const resolved = resolveVideoMediaFields({
                  videoFileUrl: value,
                  embedUrl: form.embedUrl,
                  videoUrl: form.videoUrl,
                });

                if (resolved.movedYoutubeFromFile) {
                  toast.message('YouTube link moved to Embed URL');
                  setForm(f => ({
                    ...f,
                    videoFileUrl: '',
                    embedUrl: resolved.embedUrl,
                  }));

                  return;
                }

                setForm(f => ({ ...f, videoFileUrl: value }));
              }}
              entityType="resource"
              entityId={editId}
              fallbackEntityIdPrefix="video-file"
              intent="other"
              accept="video/*"
              onPendingFileChange={setPendingVideoFile}
              helperText={`Hosted file only (mp4/webm/mov). Max ${formatUploadBytes(AUDIO_UPLOAD_MAX_BYTES)}. Use Embed URL for YouTube.`}
              maxFileSizeBytes={AUDIO_UPLOAD_MAX_BYTES}
              fileSizeLabel={formatUploadBytes(AUDIO_UPLOAD_MAX_BYTES)}
            />
            <RegularInput
              label="Embed URL (YouTube)"
              value={form.embedUrl ?? ''}
              onChange={e => setForm(f => ({ ...f, embedUrl: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
              bottomText="YouTube watch, shorts, live, or youtu.be links only."
            />
            {youtubeEmbedUrlFromInput(form.embedUrl) && (
              <div className="rounded-xl overflow-hidden border border-border/50 bg-black aspect-video">
                <iframe
                  src={youtubeEmbedUrlFromInput(form.embedUrl) ?? undefined}
                  title="YouTube preview"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            <MediaMetadataFields
              idPrefix="admin-video"
              value={durationParts}
              onChange={setDurationParts}
              disabled={loading}
            />
            <MonetizationFormFields
              idPrefix="admin-video"
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
            {isEdit &&
              (ownerMeta.ownerLocked || ownerMeta.hasArtist ? (
                <p className="text-sm text-muted-foreground rounded-md border border-border px-3 py-2 bg-muted/20">
                  Owner is set to artist profile <strong>{artistName(editListRow?.artist)}</strong>.
                  It cannot be changed.
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    No artist profile linked yet. Link a user once; the server attaches an artist
                    and locks ownership.
                  </p>
                  <AdminUserAccountPicker
                    value={assignOwnerUserId || ownerMeta.ownerUserId}
                    onChange={(id, _u) => setAssignOwnerUserId(id)}
                    initialLabel={
                      ownerMeta.ownerUserId && !assignOwnerUserId
                        ? `Pending user id: ${ownerMeta.ownerUserId}`
                        : null
                    }
                  />
                </>
              ))}
            <DialogFooter>
              <RegularBtn
                type="button"
                text="Cancel"
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              />
              {isEdit ? (
                <RegularBtn
                  type="submit"
                  text="Save"
                  loading={loading}
                  disabled={!form.title.trim()}
                />
              ) : (
                <>
                  <RegularBtn
                    type="button"
                    text="Create as draft"
                    loading={loading}
                    onClick={() => void handleSubmit(undefined, 'draft')}
                    disabled={!form.title.trim() || loading}
                  />
                  <RegularBtn
                    type="button"
                    text="Create & publish"
                    loading={loading}
                    onClick={() => void handleSubmit(undefined, 'published')}
                    disabled={!form.title.trim() || !canPublish || loading}
                  />
                </>
              )}
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
