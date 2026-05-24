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
import { MediaUrlOrUploadField } from '@/components/general/MediaUrlOrUploadField';
import type { SelectOption } from '@/lib/types/general';
import { callApi } from '@/lib/services/callApi';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import { toast } from 'sonner';
import { RESOURCE_TYPES } from '@/lib/types/community';
import {
  PUBLISHABLE_STATUS_SELECT_OPTIONS,
  PUBLISHABLE_STATUS_VALUES,
} from '@/lib/constants/adminSelectOptions';
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

interface CreateResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId: string | null;
  onSuccess: () => void;
}

const defaultForm = {
  title: '',
  description: '',
  type: 'ebook' as (typeof RESOURCE_TYPES)[number],
  category: '',
  status: 'draft' as 'draft' | 'published' | 'archived',
  coverImage: '',
};

const typeOptions: SelectOption[] = RESOURCE_TYPES.map(t => ({ text: t, value: t }));

export function CreateResourceModal({
  open,
  onOpenChange,
  editId,
  onSuccess,
}: CreateResourceModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([
    { text: 'None', value: '' },
  ]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [pendingCoverImage, setPendingCoverImage] = useState<File | null>(null);

  const isEdit = Boolean(editId);
  const coverUpload = useFileUpload({
    entityType: 'resource',
    entityId: editId ?? 'resource-pending',
    intent: 'image',
  });

  useEffect(() => {
    if (!open) return;
    setCategoriesLoading(true);
    void loadAdminContentCategorySelectOptions('resource')
      .then(opts => setCategoryOptions(opts))
      .finally(() => setCategoriesLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setPendingCoverImage(null);
      return;
    }
    if (!editId) {
      setForm(defaultForm);
      setPendingCoverImage(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    void (async () => {
      try {
        const res = await callApi('ADMIN_RESOURCE_ITEM', {
          query: `/${editId}` as `/${string}`,
        });
        if (cancelled || res.type !== 'success' || !res.data.resource) return;
        const r = res.data.resource;
        const st = (r as { status?: string }).status;
        setForm({
          title: r.title ?? '',
          description: r.description ?? '',
          type: normalizeEnumValue(r.type, RESOURCE_TYPES, 'ebook'),
          category: r.category ?? '',
          status: normalizeEnumValue(st, PUBLISHABLE_STATUS_VALUES, 'draft'),
          coverImage: r.coverImage ?? '',
        });
        setCategoryOptions(prev => ensureSelectContainsSlug(prev, r.category ?? undefined));
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
      const description = form.description.trim();
      const category = normalizeOptionalText(form.category);
      let finalCoverImage = normalizeOptionalHttpUrl(form.coverImage, 'Cover image URL');

      if (editId) {
        if (pendingCoverImage) {
          const upload = await coverUpload.uploadFile({
            file: pendingCoverImage,
            entityId: editId,
          });
          if (!upload?.url) throw new Error('Cover image upload failed');
          finalCoverImage = upload.url;
        }

        const res = await callApi('ADMIN_RESOURCE_UPDATE', {
          query: `/${editId}` as `/${string}`,
          payload: {
            title,
            description,
            type: form.type,
            category,
            status: form.status,
            coverImage: finalCoverImage,
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        const res = await callApi('ADMIN_RESOURCE_CREATE', {
          payload: {
            title,
            description,
            type: form.type,
            category,
            status: createStatus,
            coverImage: finalCoverImage || undefined,
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');

        const createdId =
          (res.data as { resource?: { _id?: string } } | undefined)?.resource?._id ??
          (res.data as { _id?: string } | undefined)?._id;

        if (createdId && pendingCoverImage) {
          const upload = await coverUpload.uploadFile({
            file: pendingCoverImage,
            entityId: createdId,
          });
          if (!upload?.url) throw new Error('Cover image upload failed');
          finalCoverImage = upload.url;

          const patchRes = await callApi('ADMIN_RESOURCE_UPDATE', {
            query: `/${createdId}` as `/${string}`,
            payload: { coverImage: finalCoverImage },
          });
          if (patchRes.type !== 'success') {
            throw new Error(patchRes.error?.message ?? 'Post-create media update failed');
          }
        }
      }
      setForm(defaultForm);
      setPendingCoverImage(null);
      onOpenChange(false);
      onSuccess();
      toast.success(isEdit ? 'Resource updated.' : 'Resource created.');
    } catch (err) {
      console.error(isEdit ? 'Update resource failed:' : 'Create resource failed:', err);
      toast.error(err instanceof Error ? err.message : 'Unable to save resource.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setForm(defaultForm);
      setPendingCoverImage(null);
    }
    onOpenChange(val);
  };

  const categorySelectOptions = ensureSelectContainsSlug(categoryOptions, form.category);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit resource' : 'Create resource'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update this resource' : 'Add a new resource'}
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
              placeholder="Enter title"
              required
            />
            <RegularSelect
              label="Type"
              value={form.type}
              onSelectChange={v =>
                setForm(f => ({ ...f, type: normalizeEnumValue(v, RESOURCE_TYPES, 'ebook') }))
              }
              options={typeOptions}
            />
            {isEdit ? (
              <RegularSelect
                label="Status"
                value={form.status}
                onSelectChange={v =>
                  setForm(f => ({
                    ...f,
                    status: normalizeEnumValue(v, PUBLISHABLE_STATUS_VALUES, 'draft'),
                  }))
                }
                options={[...PUBLISHABLE_STATUS_SELECT_OPTIONS] as SelectOption[]}
              />
            ) : null}
            <RegularSelect
              label="Category"
              value={form.category}
              onSelectChange={v => setForm(f => ({ ...f, category: v }))}
              options={categorySelectOptions}
              loading={categoriesLoading}
            />
            <RegularTextarea
              label="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Enter description"
              rows={4}
            />
            <MediaUrlOrUploadField
              label="Cover image"
              value={form.coverImage}
              onChange={value => setForm(f => ({ ...f, coverImage: value }))}
              entityType="resource"
              entityId={editId}
              fallbackEntityIdPrefix="resource-cover"
              intent="image"
              accept="image/*"
              defaultMode="upload"
              onPendingFileChange={setPendingCoverImage}
            />
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
