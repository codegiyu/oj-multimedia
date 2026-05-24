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
import type { AlbumListItem } from '@/lib/types/community';
import { AdminUserAccountPicker } from '@/components/section/admin/shared/AdminUserAccountPicker';
import { MediaUrlOrUploadField } from '@/components/general/MediaUrlOrUploadField';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import { PUBLISHABLE_STATUS_SELECT_OPTIONS } from '@/lib/constants/adminSelectOptions';

interface CreateAlbumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId: string | null;
  onSuccess: () => void;
}

const defaultForm = {
  title: '',
  excerpt: '',
  description: '',
  coverImage: '',
  releaseDate: '',
  ownerUserId: '',
  status: 'draft' as 'draft' | 'published' | 'archived',
  isFeatured: 'false',
  displayOrder: '0',
};

function albumArtistLabel(album: AlbumListItem): string {
  const a = album.artist;
  if (!a) return '—';
  if (typeof a === 'string') return a;
  return a.name ?? '—';
}

export function CreateAlbumModal({ open, onOpenChange, editId, onSuccess }: CreateAlbumModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [assignOwnerUserId, setAssignOwnerUserId] = useState('');
  const [ownerMeta, setOwnerMeta] = useState<{
    ownerLocked: boolean;
    ownerUserId: string;
    hasArtist: boolean;
  }>({ ownerLocked: false, ownerUserId: '', hasArtist: false });
  const [editListRow, setEditListRow] = useState<AlbumListItem | null>(null);
  const [pendingCoverImage, setPendingCoverImage] = useState<File | null>(null);

  const isEdit = Boolean(editId);
  const coverUpload = useFileUpload({
    entityType: 'album',
    entityId: editId ?? 'album-pending',
    intent: 'image',
  });

  const featuredOptions: SelectOption[] = [
    { text: 'No', value: 'false' },
    { text: 'Yes', value: 'true' },
  ];

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setAssignOwnerUserId('');
      setOwnerMeta({ ownerLocked: false, ownerUserId: '', hasArtist: false });
      setEditListRow(null);
      setPendingCoverImage(null);
      return;
    }
    if (!editId) {
      setForm(defaultForm);
      setAssignOwnerUserId('');
      setOwnerMeta({ ownerLocked: false, ownerUserId: '', hasArtist: false });
      setEditListRow(null);
      return;
    }

    let cancelled = false;
    setDetailLoading(true);
    void (async () => {
      try {
        const res = await callApi('ADMIN_ALBUM_ITEM', {
          query: `/${editId}` as `/${string}`,
        });
        if (cancelled || res.type !== 'success' || !res.data.album) return;
        const a = res.data.album;
        setEditListRow(a);
        setForm({
          title: a.title ?? '',
          excerpt: a.excerpt ?? '',
          description: a.description ?? '',
          coverImage: a.coverImage ?? '',
          releaseDate: a.releaseDate ? a.releaseDate.slice(0, 10) : '',
          ownerUserId: '',
          status: (a.status as 'draft' | 'published' | 'archived') ?? 'draft',
          isFeatured: a.isFeatured ? 'true' : 'false',
          displayOrder: String(a.displayOrder ?? 0),
        });
        const hasArtist = Boolean(a.artist);
        setOwnerMeta({
          ownerLocked: Boolean(a.ownerLocked ?? hasArtist),
          ownerUserId: a.ownerUserId ?? '',
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
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        title: form.title.trim(),
        excerpt: form.excerpt?.trim() ?? '',
        description: form.description?.trim() ?? '',
        coverImage: form.coverImage?.trim() || undefined,
        releaseDate: form.releaseDate?.trim() || null,
        status: isEdit ? form.status : createStatus,
        isFeatured: form.isFeatured === 'true',
        displayOrder: Number.parseInt(form.displayOrder, 10) || 0,
      };

      if (editId && pendingCoverImage) {
        const upload = await coverUpload.uploadFile({ file: pendingCoverImage, entityId: editId });
        if (!upload?.url) throw new Error('Cover image upload failed');
        payload.coverImage = upload.url;
      }

      if (!isEdit && form.ownerUserId) payload.ownerUserId = form.ownerUserId;

      if (isEdit) {
        const canAssignOwner = !ownerMeta.ownerLocked && !ownerMeta.hasArtist;
        if (canAssignOwner && assignOwnerUserId) {
          payload.ownerUserId = assignOwnerUserId;
        }
      }

      if (editId) {
        const res = await callApi('ADMIN_ALBUM_UPDATE', {
          query: `/${editId}` as `/${string}`,
          payload,
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        if (pendingCoverImage && !payload.coverImage) {
          payload.coverImage = '';
        }
        const res = await callApi('ADMIN_ALBUM_CREATE', { payload });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');
        const createdId = res.data.album?._id;
        if (createdId && pendingCoverImage) {
          const upload = await coverUpload.uploadFile({
            file: pendingCoverImage,
            entityId: createdId,
          });
          if (!upload?.url) throw new Error('Cover image upload failed');
          const patch = await callApi('ADMIN_ALBUM_UPDATE', {
            query: `/${createdId}` as `/${string}`,
            payload: { coverImage: upload.url },
          });
          if (patch.type !== 'success') {
            throw new Error(patch.error?.message ?? 'Post-create media update failed');
          }
        }
      }

      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error(isEdit ? 'Update album failed:' : 'Create album failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) setForm(defaultForm);
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit album' : 'Create album'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update album metadata and publishing settings' : 'Add a new album'}
          </DialogDescription>
        </DialogHeader>
        {detailLoading ? (
          <p className="text-sm text-muted-foreground py-4">Loading…</p>
        ) : (
          <form onSubmit={e => void handleSubmit(e)} className="grid gap-4">
            {!isEdit && (
              <AdminUserAccountPicker
                value={form.ownerUserId}
                onChange={(userId, _u) => setForm(f => ({ ...f, ownerUserId: userId }))}
                description="Optional. Links this album to a user’s artist profile on the server."
              />
            )}
            <RegularInput
              label="Title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Album title"
              required
            />
            {isEdit ? (
              <RegularSelect
                label="Status"
                value={form.status}
                onSelectChange={v => setForm(f => ({ ...f, status: v as typeof form.status }))}
                options={[...PUBLISHABLE_STATUS_SELECT_OPTIONS] as SelectOption[]}
              />
            ) : null}
            <RegularInput
              label="Release date"
              type="date"
              value={form.releaseDate}
              onChange={e => setForm(f => ({ ...f, releaseDate: e.target.value }))}
            />
            <RegularSelect
              label="Featured on listings"
              value={form.isFeatured}
              onSelectChange={v => setForm(f => ({ ...f, isFeatured: v }))}
              options={featuredOptions}
            />
            <RegularInput
              label="Display order"
              type="number"
              value={form.displayOrder}
              onChange={e => setForm(f => ({ ...f, displayOrder: e.target.value }))}
              placeholder="0"
            />
            <MediaUrlOrUploadField
              label="Cover image"
              value={form.coverImage}
              onChange={value => setForm(f => ({ ...f, coverImage: value }))}
              entityType="album"
              entityId={editId}
              fallbackEntityIdPrefix="album-cover"
              intent="image"
              accept="image/*"
              defaultMode="upload"
              onPendingFileChange={setPendingCoverImage}
            />
            <RegularTextarea
              label="Excerpt"
              value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              placeholder="Short summary"
              rows={2}
            />
            <RegularTextarea
              label="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Full description"
              rows={4}
            />
            {isEdit &&
              (ownerMeta.ownerLocked || ownerMeta.hasArtist ? (
                <p className="text-sm text-muted-foreground rounded-md border border-border px-3 py-2 bg-muted/20">
                  Linked artist:{' '}
                  <strong>{editListRow ? albumArtistLabel(editListRow) : '—'}</strong>. Ownership
                  cannot be changed.
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Optional: link a user account once so this album is attributed to their artist
                    profile.
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
                    disabled={!form.title.trim() || loading}
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
