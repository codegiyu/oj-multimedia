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
  IArtistCreateMusicPayload,
  IAdminCreateMusicPayload,
  IAdminUpdateMusicPayload,
  ArtistMusicListItem,
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
import { MonetizationFormFields } from '@/components/section/admin/shared/MonetizationFormFields';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import {
  PUBLISHABLE_STATUS_SELECT_OPTIONS,
  PUBLISHABLE_STATUS_VALUES,
} from '@/lib/constants/adminSelectOptions';
import {
  ensureAlbumSelectContainsCurrent,
  loadPublishedAlbumSelectOptions,
  resolveContentArtistId,
} from '@/lib/utils/adminMusicAlbumSelect';
import { parseCommaSeparatedTags, formatTagsForInput } from '@/lib/utils/adminCommaTags';
import { readAudioMetadata, type ClientMediaMetadata } from '@/lib/utils/mediaMetadataClient';

interface CreateMusicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId: string | null;
  onSuccess: () => void;
}

const defaultForm: Omit<IArtistCreateMusicPayload, 'tags'> & {
  artistId: string;
  ownerUserId: string;
  tags: string;
} = {
  title: '',
  description: '',
  lyrics: '',
  excerpt: '',
  category: '',
  coverImage: '',
  audioUrl: '',
  videoUrl: '',
  downloadUrl: '',
  isMonetizable: false,
  price: 0,
  artistId: '',
  ownerUserId: '',
  albumId: '',
  tags: '',
};

function artistName(artist: ArtistMusicListItem['artist']): string {
  if (!artist) return '—';
  return typeof artist === 'string' ? artist : ((artist as { name?: string }).name ?? '—');
}

export function CreateMusicModal({ open, onOpenChange, editId, onSuccess }: CreateMusicModalProps) {
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
  const [editListRow, setEditListRow] = useState<ArtistMusicListItem | null>(null);
  const [pendingCover, setPendingCover] = useState<File | null>(null);
  const [pendingAudio, setPendingAudio] = useState<File | null>(null);
  const [albumOptions, setAlbumOptions] = useState<SelectOption[]>([
    { text: 'No album', value: '' },
  ]);
  const [albumsLoading, setAlbumsLoading] = useState(false);
  const [createOwnerArtistId, setCreateOwnerArtistId] = useState('');
  const [capturedMetadata, setCapturedMetadata] = useState<ClientMediaMetadata | null>(null);

  const isEdit = Boolean(editId);
  const canPublish = Boolean((form.category ?? '').trim());
  const resolvedArtistId = isEdit
    ? resolveContentArtistId(editListRow?.artist)
    : form.artistId.trim() || createOwnerArtistId.trim() || null;
  const coverUpload = useFileUpload({
    entityType: 'music',
    entityId: editId ?? 'music-pending',
    intent: 'image',
  });
  const audioUpload = useFileUpload({
    entityType: 'music',
    entityId: editId ?? 'music-pending',
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
    void loadAdminContentCategorySelectOptions('music')
      .then(opts => setCategoryOptions(opts))
      .finally(() => setCategoriesLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open || resolvedArtistId) return;
    setForm(f => (f.albumId ? { ...f, albumId: '' } : f));
  }, [open, resolvedArtistId]);

  useEffect(() => {
    if (!open) {
      setAlbumOptions([{ text: 'No album', value: '' }]);
      setCreateOwnerArtistId('');
      return;
    }

    if (!resolvedArtistId) {
      setAlbumOptions([{ text: 'No album', value: '' }]);
      return;
    }

    let cancelled = false;
    setAlbumsLoading(true);
    void loadPublishedAlbumSelectOptions(resolvedArtistId)
      .then(opts => {
        if (cancelled) return;
        setAlbumOptions(
          ensureAlbumSelectContainsCurrent(
            opts,
            form.albumId ?? undefined,
            editListRow?.album?.title
          )
        );
      })
      .finally(() => {
        if (!cancelled) setAlbumsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, resolvedArtistId, editListRow?.album?.title, form.albumId]);

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setEditStatus('draft');
      setAssignOwnerUserId('');
      setOwnerMeta({ ownerLocked: false, ownerUserId: '', hasArtist: false });
      setEditListRow(null);
      setCreateOwnerArtistId('');
      return;
    }
    if (!editId) {
      setForm(defaultForm);
      setEditStatus('draft');
      setAssignOwnerUserId('');
      setOwnerMeta({ ownerLocked: false, ownerUserId: '', hasArtist: false });
      setEditListRow(null);
      setCreateOwnerArtistId('');
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    void (async () => {
      try {
        const res = await callApi('ADMIN_MUSIC_ITEM', {
          query: `/${editId}` as `/${string}`,
        });
        if (cancelled || res.type !== 'success' || !res.data.music) return;
        const m = res.data.music;
        setEditListRow(m);
        setCategoryOptions(prev => ensureSelectContainsSlug(prev, m.category ?? undefined));
        setForm({
          title: m.title ?? '',
          description: m.description ?? '',
          lyrics: m.lyrics ?? '',
          excerpt: m.excerpt ?? '',
          category: m.category ?? '',
          coverImage: m.coverImage ?? '',
          audioUrl: m.audioUrl ?? '',
          videoUrl: m.videoUrl ?? '',
          downloadUrl: m.downloadUrl ?? '',
          isMonetizable: Boolean(m.isMonetizable),
          price: typeof m.price === 'number' ? m.price : Number(m.price) || 0,
          artistId: '',
          ownerUserId: '',
          albumId: m.albumId ?? m.album?._id ?? '',
          tags: formatTagsForInput((m as { tags?: string[] }).tags),
        });
        setEditStatus(normalizeEnumValue(m.status, PUBLISHABLE_STATUS_VALUES, 'draft'));
        const hasArtist = Boolean(m.artist);
        setOwnerMeta({
          ownerLocked: Boolean(m.ownerLocked ?? hasArtist),
          ownerUserId: m.ownerUserId ?? '',
          hasArtist,
        });
        setAssignOwnerUserId('');
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
      const lyrics = normalizeOptionalText(form.lyrics ?? '');
      const excerpt = normalizeOptionalText(form.excerpt ?? '');
      const category = form.category ?? '';
      const tags = parseCommaSeparatedTags(form.tags);
      const coverImage = normalizeOptionalHttpUrl(form.coverImage ?? '', 'Cover image URL');
      const audioUrl = normalizeOptionalHttpUrl(form.audioUrl ?? '', 'Audio URL');
      const videoUrl = normalizeOptionalHttpUrl(form.videoUrl ?? '', 'Video URL');
      const downloadUrl = normalizeOptionalHttpUrl(form.downloadUrl ?? '', 'Download URL');

      assertMonetizationPriceClient(form.isMonetizable, form.price);
      const isMonetizable = Boolean(form.isMonetizable);
      const price = resolveMonetizationFormPrice(isMonetizable, form.price);

      let finalCoverImage = coverImage;
      let finalAudioUrl = audioUrl;
      const finalVideoUrl = videoUrl;

      const finalDownloadUrl = downloadUrl;

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

        const payload: IAdminUpdateMusicPayload = {
          title,
          description: description || undefined,
          lyrics: lyrics || undefined,
          excerpt,
          category,
          tags,
          ...(capturedMetadata ? { metadata: capturedMetadata } : {}),
          coverImage: finalCoverImage,
          audioUrl: finalAudioUrl,
          videoUrl: finalVideoUrl,
          downloadUrl: finalDownloadUrl,
          isMonetizable,
          price,
          status: editStatus,
        };

        const canAssignOwner = !ownerMeta.ownerLocked && !ownerMeta.hasArtist;

        if (canAssignOwner && assignOwnerUserId) {
          payload.ownerUserId = assignOwnerUserId;
        }

        payload.albumId = form.albumId?.trim() ? form.albumId.trim() : '';

        const res = await callApi('ADMIN_MUSIC_UPDATE', {
          query: `/${editId}` as `/${string}`,
          payload,
        });

        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        const payload: IAdminCreateMusicPayload = {
          title,
          description,
          lyrics,
          excerpt,
          category,
          tags,
          coverImage: finalCoverImage || undefined,
          audioUrl: finalAudioUrl || undefined,
          videoUrl: finalVideoUrl || undefined,
          downloadUrl: finalDownloadUrl || undefined,
          isMonetizable,
          price,
          status: createStatus,
        };

        if (form.artistId) payload.artistId = form.artistId;

        if (form.ownerUserId) payload.ownerUserId = form.ownerUserId;

        if (form.albumId?.trim()) payload.albumId = form.albumId.trim();

        const res = await callApi('ADMIN_MUSIC_CREATE', { payload });

        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');

        const createdId =
          (res.data as { music?: { _id?: string }; _id?: string } | undefined)?.music?._id ??
          (res.data as { _id?: string } | undefined)?._id;

        if (createdId) {
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

          if (pendingCover || pendingAudio || capturedMetadata) {
            const patchRes = await callApi('ADMIN_MUSIC_UPDATE', {
              query: `/${createdId}` as `/${string}`,
              payload: {
                coverImage: finalCoverImage,
                audioUrl: finalAudioUrl,
                ...(capturedMetadata ? { metadata: capturedMetadata } : {}),
              },
            });

            if (patchRes.type !== 'success')
              throw new Error(patchRes.error?.message ?? 'Post-create media update failed');
          }
        }
      }

      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();

      toast.success(isEdit ? 'Music track updated.' : 'Music track created.');
    } catch (err) {
      console.error(isEdit ? 'Update music failed:' : 'Create music failed:', err);
      toast.error(err instanceof Error ? err.message : 'Unable to save music track.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) setForm(defaultForm);
    onOpenChange(val);
  };

  const categorySelectOptions = ensureSelectContainsSlug(categoryOptions, form.category);
  const handlePendingAudio = (file: File | null) => {
    setPendingAudio(file);
    if (!file) {
      setCapturedMetadata(null);
      return;
    }
    void readAudioMetadata(file)
      .then(meta => setCapturedMetadata(meta))
      .catch(() => setCapturedMetadata(null));
  };

  const albumSelectOptions = ensureAlbumSelectContainsCurrent(
    albumOptions,
    form.albumId ?? undefined,
    editListRow?.album?.title
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit music' : 'Create music'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update this track' : 'Add a new music track'}
          </DialogDescription>
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
                  onSelectChange={v => {
                    setForm(f => ({ ...f, artistId: v, ...(v ? { albumId: '' } : {}) }));
                    if (v) setCreateOwnerArtistId('');
                  }}
                  options={artistOptions}
                  loading={artistsLoading}
                />
                <AdminUserAccountPicker
                  value={form.ownerUserId}
                  onChange={(userId, user) => {
                    setCreateOwnerArtistId(user?.artistId ?? '');
                    setForm(f => ({
                      ...f,
                      ownerUserId: userId,
                      albumId: '',
                      ...(userId ? { artistId: '' } : {}),
                    }));
                  }}
                  description="If set, the server links this user to an artist profile (creating one if needed). Choosing a user clears the artist dropdown; use one linking method if your API rejects both."
                />
              </>
            )}
            {resolvedArtistId ? (
              <RegularSelect
                label="Album (optional)"
                value={form.albumId ?? ''}
                onSelectChange={v => setForm(f => ({ ...f, albumId: v }))}
                options={albumSelectOptions}
                loading={albumsLoading}
                subtext="Published albums for this track's artist. The server rejects albums that belong to a different artist."
              />
            ) : (
              <p className="text-sm text-muted-foreground rounded-md border border-border px-3 py-2 bg-muted/20">
                Link an artist profile to choose an album for this track.
              </p>
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
              placeholder="e.g. worship, praise, live"
              bottomText="Separate tags with commas"
            />
            <RegularTextarea
              label="Description"
              value={form.description ?? ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Enter description"
              rows={3}
            />
            <RegularTextarea
              label="Lyrics"
              value={form.lyrics ?? ''}
              onChange={e => setForm(f => ({ ...f, lyrics: e.target.value }))}
              placeholder="Enter lyrics (optional)"
              rows={4}
            />
            <RegularInput
              label="Excerpt"
              value={form.excerpt ?? ''}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              placeholder="Short excerpt for cards"
            />
            <MediaUrlOrUploadField
              label="Cover image URL"
              value={form.coverImage ?? ''}
              onChange={value => setForm(f => ({ ...f, coverImage: value }))}
              entityType="music"
              entityId={editId}
              fallbackEntityIdPrefix="music-cover"
              intent="image"
              accept="image/*"
              defaultMode="upload"
              onPendingFileChange={setPendingCover}
            />
            <MediaUrlOrUploadField
              label="Audio URL"
              value={form.audioUrl ?? ''}
              onChange={value => setForm(f => ({ ...f, audioUrl: value }))}
              entityType="music"
              entityId={editId}
              fallbackEntityIdPrefix="music-audio"
              intent="other"
              accept="audio/*"
              onPendingFileChange={handlePendingAudio}
            />
            <MonetizationFormFields
              idPrefix="admin-music"
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
            <RegularInput
              label="Download URL"
              value={form.downloadUrl ?? ''}
              onChange={e => setForm(f => ({ ...f, downloadUrl: e.target.value }))}
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
