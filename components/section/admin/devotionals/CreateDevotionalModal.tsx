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
import { DEVOTIONAL_TYPES } from '@/lib/types/community';
import type { DevotionalListItem } from '@/lib/types/community';
import { AdminUserAccountPicker } from '@/components/section/admin/shared/AdminUserAccountPicker';
import { MediaUrlOrUploadField } from '@/components/general/MediaUrlOrUploadField';
import {
  ensureSelectContainsSlug,
  loadAdminContentCategorySelectOptions,
} from '@/lib/utils/adminContentCategorySelect';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import { MEDIA_FALLBACK_URLS } from '@/lib/constants/mediaFallbackUrls';

interface CreateDevotionalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId: string | null;
  onSuccess: () => void;
}

const defaultForm = {
  title: '',
  excerpt: '',
  content: '',
  category: '',
  author: '',
  coverImage: '',
  ownerUserId: '',
  type: 'daily' as (typeof DEVOTIONAL_TYPES)[number],
  status: 'draft' as 'draft' | 'published' | 'archived',
};

const statusOptions: SelectOption[] = [
  { text: 'Draft', value: 'draft' },
  { text: 'Published', value: 'published' },
  { text: 'Archived', value: 'archived' },
];

const typeOptions: SelectOption[] = DEVOTIONAL_TYPES.map(t => ({ text: t, value: t }));

function devotionalArtistLabel(d: DevotionalListItem): string {
  const a = d.artist;
  if (!a) return '—';
  if (typeof a === 'string') return a;
  return a.name ?? '—';
}

export function CreateDevotionalModal({
  open,
  onOpenChange,
  editId,
  onSuccess,
}: CreateDevotionalModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([
    { text: 'None', value: '' },
  ]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [assignOwnerUserId, setAssignOwnerUserId] = useState('');
  const [ownerMeta, setOwnerMeta] = useState<{
    ownerLocked: boolean;
    ownerUserId: string;
    hasArtist: boolean;
  }>({ ownerLocked: false, ownerUserId: '', hasArtist: false });
  const [editListRow, setEditListRow] = useState<DevotionalListItem | null>(null);
  const [pendingCoverImage, setPendingCoverImage] = useState<File | null>(null);

  const isEdit = Boolean(editId);
  const coverUpload = useFileUpload({
    entityType: 'devotional',
    entityId: editId ?? 'devotional-pending',
    intent: 'image',
  });

  useEffect(() => {
    if (!open) return;
    setCategoriesLoading(true);
    void loadAdminContentCategorySelectOptions('devotional')
      .then(opts => setCategoryOptions(opts))
      .finally(() => setCategoriesLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setAssignOwnerUserId('');
      setOwnerMeta({ ownerLocked: false, ownerUserId: '', hasArtist: false });
      setEditListRow(null);
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
        const res = await callApi('ADMIN_DEVOTIONAL_ITEM', {
          query: `/${editId}` as `/${string}`,
        });
        if (cancelled || res.type !== 'success' || !res.data.devotional) return;
        const d = res.data.devotional;
        setEditListRow(d as DevotionalListItem);
        setCategoryOptions(prev => ensureSelectContainsSlug(prev, d.category ?? undefined));
        setForm({
          title: d.title ?? '',
          excerpt: d.excerpt ?? '',
          content: d.content ?? '',
          category: d.category ?? '',
          author: d.author ?? '',
          coverImage: d.coverImage ?? '',
          ownerUserId: '',
          type: (d.type as (typeof DEVOTIONAL_TYPES)[number]) ?? 'daily',
          status: (d.status as 'draft' | 'published' | 'archived') ?? 'draft',
        });
        const hasArtist = Boolean(d.artist);
        setOwnerMeta({
          ownerLocked: Boolean(d.ownerLocked ?? hasArtist),
          ownerUserId: d.ownerUserId ?? '',
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
      const payload: Record<string, unknown> = {
        title: form.title.trim(),
        excerpt: form.excerpt?.trim() ?? '',
        content: form.content?.trim() ?? '',
        category: form.category?.trim() || undefined,
        author: form.author?.trim() || undefined,
        coverImage: form.coverImage?.trim() || undefined,
        type: form.type,
        status: form.status,
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
        const res = await callApi('ADMIN_DEVOTIONAL_UPDATE', {
          query: `/${editId}` as `/${string}`,
          payload,
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        if (pendingCoverImage && !payload.coverImage) {
          payload.coverImage = MEDIA_FALLBACK_URLS.image;
        }
        const res = await callApi('ADMIN_DEVOTIONAL_CREATE', { payload });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');
        const createdId =
          (res.data as { devotional?: { _id?: string }; _id?: string } | undefined)?.devotional
            ?._id ?? (res.data as { _id?: string } | undefined)?._id;
        if (createdId && pendingCoverImage) {
          const upload = await coverUpload.uploadFile({
            file: pendingCoverImage,
            entityId: createdId,
          });
          if (!upload?.url) throw new Error('Cover image upload failed');
          const patch = await callApi('ADMIN_DEVOTIONAL_UPDATE', {
            query: `/${createdId}` as `/${string}`,
            payload: { coverImage: upload.url },
          });
          if (patch.type !== 'success')
            throw new Error(patch.error?.message ?? 'Post-create media update failed');
        }
      }
      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error(isEdit ? 'Update devotional failed:' : 'Create devotional failed:', err);
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit devotional' : 'Create devotional'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update this devotional' : 'Add a new devotional'}
          </DialogDescription>
        </DialogHeader>
        {detailLoading ? (
          <p className="text-sm text-muted-foreground py-4">Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            {!isEdit && (
              <AdminUserAccountPicker
                value={form.ownerUserId}
                onChange={(userId, _u) => setForm(f => ({ ...f, ownerUserId: userId }))}
                description="Optional. Links this devotional to a user’s artist profile on the server."
              />
            )}
            <RegularInput
              label="Title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Enter title"
              required
            />
            <RegularSelect
              label="Type"
              value={form.type}
              onSelectChange={v => setForm(f => ({ ...f, type: v as typeof form.type }))}
              options={typeOptions}
            />
            <RegularSelect
              label="Status"
              value={form.status}
              onSelectChange={v => setForm(f => ({ ...f, status: v as typeof form.status }))}
              options={statusOptions}
            />
            <RegularInput
              label="Author"
              value={form.author}
              onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
              placeholder="Enter author"
            />
            <RegularSelect
              label="Category"
              value={form.category}
              onSelectChange={v => setForm(f => ({ ...f, category: v }))}
              options={categorySelectOptions}
              loading={categoriesLoading}
            />
            <MediaUrlOrUploadField
              label="Cover image URL"
              value={form.coverImage}
              onChange={value => setForm(f => ({ ...f, coverImage: value }))}
              placeholder="Featured image URL"
              entityType="devotional"
              entityId={editId}
              fallbackEntityIdPrefix="devotional-cover"
              intent="image"
              accept="image/*"
              defaultMode="upload"
              onPendingFileChange={setPendingCoverImage}
            />
            <RegularTextarea
              label="Excerpt"
              value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              placeholder="Enter excerpt"
              rows={2}
            />
            <RegularTextarea
              label="Content"
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Enter content"
              rows={4}
            />
            {isEdit &&
              (ownerMeta.ownerLocked || ownerMeta.hasArtist ? (
                <p className="text-sm text-muted-foreground rounded-md border border-border px-3 py-2 bg-muted/20">
                  Linked artist:{' '}
                  <strong>{editListRow ? devotionalArtistLabel(editListRow) : '—'}</strong>.
                  Ownership cannot be changed.
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Optional: link a user account once so this devotional is attributed to their
                    artist profile.
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
