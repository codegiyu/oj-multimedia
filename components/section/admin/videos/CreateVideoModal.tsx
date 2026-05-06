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
import type {
  IArtistCreateVideoPayload,
  IAdminCreateVideoPayload,
  IAdminUpdateVideoPayload,
  ArtistVideoListItem,
} from '@/lib/constants/endpoints';
import { AdminUserAccountPicker } from '@/components/section/admin/shared/AdminUserAccountPicker';
import {
  ensureSelectContainsSlug,
  loadAdminContentCategorySelectOptions,
} from '@/lib/utils/adminContentCategorySelect';

interface CreateVideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId: string | null;
  onSuccess: () => void;
}

const defaultForm: IArtistCreateVideoPayload & { artistId: string; ownerUserId: string } = {
  title: '',
  description: '',
  thumbnail: '',
  videoUrl: '',
  videoFileUrl: '',
  embedUrl: '',
  category: '',
  artistId: '',
  ownerUserId: '',
};

const statusOptions: SelectOption[] = [
  { text: 'Draft', value: 'draft' },
  { text: 'Published', value: 'published' },
  { text: 'Archived', value: 'archived' },
];

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
          artistId: '',
          ownerUserId: '',
        });
        setEditStatus(v.status ?? 'draft');
        const hasArtist = Boolean(v.artist);
        setOwnerMeta({
          ownerLocked: Boolean(v.ownerLocked ?? hasArtist),
          ownerUserId: v.ownerUserId ?? '',
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
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      if (editId) {
        const payload: IAdminUpdateVideoPayload = {
          title: form.title.trim(),
          description: form.description?.trim() || undefined,
          thumbnail: form.thumbnail?.trim() || undefined,
          videoUrl: form.videoUrl?.trim() || undefined,
          videoFileUrl: form.videoFileUrl?.trim() || undefined,
          embedUrl: form.embedUrl?.trim() || undefined,
          category: form.category?.trim() || undefined,
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
        const payload: IAdminCreateVideoPayload = {
          title: form.title.trim(),
          description: form.description?.trim() ?? '',
          thumbnail: form.thumbnail?.trim() || undefined,
          videoUrl: form.videoUrl?.trim() || undefined,
          videoFileUrl: form.videoFileUrl?.trim() || undefined,
          embedUrl: form.embedUrl?.trim() || undefined,
          category: form.category?.trim() || undefined,
        };
        if (form.artistId) payload.artistId = form.artistId;
        if (form.ownerUserId) payload.ownerUserId = form.ownerUserId;
        const res = await callApi('ADMIN_VIDEO_CREATE', { payload });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');
      }
      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error(isEdit ? 'Update video failed:' : 'Create video failed:', err);
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
          <DialogTitle>{isEdit ? 'Edit video' : 'Create video'}</DialogTitle>
          <DialogDescription>{isEdit ? 'Update this video' : 'Add a new video'}</DialogDescription>
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
                onSelectChange={v => setEditStatus(v as 'draft' | 'published' | 'archived')}
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
            <RegularInput
              label="Thumbnail URL"
              value={form.thumbnail ?? ''}
              onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))}
            />
            <RegularInput
              label="Video file URL"
              value={form.videoFileUrl ?? ''}
              onChange={e => setForm(f => ({ ...f, videoFileUrl: e.target.value }))}
            />
            <RegularInput
              label="Embed URL (YouTube)"
              value={form.embedUrl ?? ''}
              onChange={e => setForm(f => ({ ...f, embedUrl: e.target.value }))}
            />
            <RegularInput
              label="Legacy videoUrl"
              value={form.videoUrl ?? ''}
              onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
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
