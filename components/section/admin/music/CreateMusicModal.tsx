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
import {
  ensureSelectContainsSlug,
  loadAdminContentCategorySelectOptions,
} from '@/lib/utils/adminContentCategorySelect';
import {
  normalizeEnumValue,
  normalizeOptionalHttpUrl,
  normalizeOptionalText,
  requireText,
} from '@/lib/utils/adminFormValidation';

interface CreateMusicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId: string | null;
  onSuccess: () => void;
}

const defaultForm: IArtistCreateMusicPayload & { artistId: string; ownerUserId: string } = {
  title: '',
  description: '',
  lyrics: '',
  excerpt: '',
  category: '',
  coverImage: '',
  audioUrl: '',
  videoUrl: '',
  downloadUrl: '',
  artistId: '',
  ownerUserId: '',
};

const statusOptions: SelectOption[] = [
  { text: 'Draft', value: 'draft' },
  { text: 'Published', value: 'published' },
  { text: 'Archived', value: 'archived' },
];
const STATUS_VALUES = ['draft', 'published', 'archived'] as const;

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

  const isEdit = Boolean(editId);

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
    if (!open) {
      setForm(defaultForm);
      setEditStatus('draft');
      setAssignOwnerUserId('');
      setOwnerMeta({ ownerLocked: false, ownerUserId: '', hasArtist: false });
      setEditListRow(null);
      return;
    }
    if (!editId) {
      setForm(defaultForm);
      setEditStatus('draft');
      setAssignOwnerUserId('');
      setOwnerMeta({ ownerLocked: false, ownerUserId: '', hasArtist: false });
      setEditListRow(null);
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
          artistId: '',
          ownerUserId: '',
        });
        setEditStatus(normalizeEnumValue(m.status, STATUS_VALUES, 'draft'));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const title = requireText(form.title, 'Title');
      const description = normalizeOptionalText(form.description ?? '');
      const lyrics = normalizeOptionalText(form.lyrics ?? '');
      const excerpt = normalizeOptionalText(form.excerpt ?? '');
      const category = normalizeOptionalText(form.category ?? '');
      const coverImage = normalizeOptionalHttpUrl(form.coverImage ?? '', 'Cover image URL');
      const audioUrl = normalizeOptionalHttpUrl(form.audioUrl ?? '', 'Audio URL');
      const videoUrl = normalizeOptionalHttpUrl(form.videoUrl ?? '', 'Video URL');
      const downloadUrl = normalizeOptionalHttpUrl(form.downloadUrl ?? '', 'Download URL');

      if (editId) {
        const payload: IAdminUpdateMusicPayload = {
          title,
          description: description || undefined,
          lyrics: lyrics || undefined,
          excerpt,
          category,
          coverImage,
          audioUrl,
          videoUrl,
          downloadUrl,
          status: editStatus,
        };
        const canAssignOwner = !ownerMeta.ownerLocked && !ownerMeta.hasArtist;
        if (canAssignOwner && assignOwnerUserId) {
          payload.ownerUserId = assignOwnerUserId;
        }
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
          coverImage,
          audioUrl,
          videoUrl,
          downloadUrl,
        };
        if (form.artistId) payload.artistId = form.artistId;
        if (form.ownerUserId) payload.ownerUserId = form.ownerUserId;
        const res = await callApi('ADMIN_MUSIC_CREATE', { payload });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit music' : 'Create music'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update this track' : 'Add a new music track'}
          </DialogDescription>
        </DialogHeader>
        {detailLoading ? (
          <p className="text-sm text-muted-foreground py-4">Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
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
                  description="If set, the server links this user to an artist profile (creating one if needed). Choosing a user clears the artist dropdown; use one linking method if your API rejects both."
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
                onSelectChange={v => setEditStatus(normalizeEnumValue(v, STATUS_VALUES, 'draft'))}
                options={statusOptions}
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
            <RegularInput
              label="Cover image URL"
              value={form.coverImage ?? ''}
              onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
            />
            <RegularInput
              label="Audio URL"
              value={form.audioUrl ?? ''}
              onChange={e => setForm(f => ({ ...f, audioUrl: e.target.value }))}
            />
            <RegularInput
              label="Video URL (legacy)"
              value={form.videoUrl ?? ''}
              onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
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
              <RegularBtn
                type="submit"
                text={isEdit ? 'Save' : 'Create'}
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
