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
import { TESTIMONY_CATEGORY_SELECT_OPTIONS } from '@/lib/constants/communityCategorySelectOptions';
import {
  PUBLISHABLE_STATUS_SELECT_OPTIONS,
  PUBLISHABLE_STATUS_VALUES,
} from '@/lib/constants/adminSelectOptions';
import { ensureSelectContainsSlug } from '@/lib/utils/adminContentCategorySelect';
import {
  normalizeEnumValue,
  normalizeOptionalHttpUrl,
  normalizeOptionalText,
  requireText,
} from '@/lib/utils/adminFormValidation';

interface CreateTestimonyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId: string | null;
  onSuccess: () => void;
}

const defaultForm = {
  author: '',
  content: '',
  category: '',
  status: 'draft' as 'draft' | 'published' | 'archived',
  avatar: '',
};

const baseCategoryOptions: SelectOption[] = [
  { text: 'None', value: '' },
  ...TESTIMONY_CATEGORY_SELECT_OPTIONS,
];

export function CreateTestimonyModal({
  open,
  onOpenChange,
  editId,
  onSuccess,
}: CreateTestimonyModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>(baseCategoryOptions);
  const [pendingAvatar, setPendingAvatar] = useState<File | null>(null);

  const isEdit = Boolean(editId);
  const avatarUpload = useFileUpload({
    entityType: 'testimony',
    entityId: editId ?? 'testimony-pending',
    intent: 'image',
  });

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setCategoryOptions(baseCategoryOptions);
      setPendingAvatar(null);
      return;
    }
    if (!editId) {
      setForm(defaultForm);
      setCategoryOptions(baseCategoryOptions);
      setPendingAvatar(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    void (async () => {
      try {
        const res = await callApi('ADMIN_TESTIMONY_ITEM', {
          query: `/${editId}` as `/${string}`,
        });
        if (cancelled || res.type !== 'success' || !res.data.testimony) return;
        const t = res.data.testimony;
        setCategoryOptions(ensureSelectContainsSlug(baseCategoryOptions, t.category ?? undefined));
        const st = (t as { status?: string }).status;
        setForm({
          author: t.author ?? '',
          content: t.content ?? '',
          category: t.category ?? '',
          status: normalizeEnumValue(st, PUBLISHABLE_STATUS_VALUES, 'draft'),
          avatar: t.avatar ?? '',
        });
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
      const author = requireText(form.author, 'Author');
      const content = requireText(form.content, 'Content');
      const category = normalizeOptionalText(form.category);
      let finalAvatar = normalizeOptionalHttpUrl(form.avatar, 'Avatar URL');

      if (editId) {
        if (pendingAvatar) {
          const upload = await avatarUpload.uploadFile({ file: pendingAvatar, entityId: editId });
          if (!upload?.url) throw new Error('Avatar upload failed');
          finalAvatar = upload.url;
        }

        const res = await callApi('ADMIN_TESTIMONY_UPDATE', {
          query: `/${editId}` as `/${string}`,
          payload: {
            author,
            content,
            category,
            status: form.status,
            avatar: finalAvatar,
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        const res = await callApi('ADMIN_TESTIMONY_CREATE', {
          payload: {
            author,
            content,
            category,
            status: createStatus,
            avatar: finalAvatar || undefined,
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');

        const createdId =
          (res.data as { testimony?: { _id?: string } } | undefined)?.testimony?._id ??
          (res.data as { _id?: string } | undefined)?._id;

        if (createdId && pendingAvatar) {
          const upload = await avatarUpload.uploadFile({
            file: pendingAvatar,
            entityId: createdId,
          });
          if (!upload?.url) throw new Error('Avatar upload failed');
          finalAvatar = upload.url;

          const patchRes = await callApi('ADMIN_TESTIMONY_UPDATE', {
            query: `/${createdId}` as `/${string}`,
            payload: { avatar: finalAvatar },
          });
          if (patchRes.type !== 'success') {
            throw new Error(patchRes.error?.message ?? 'Post-create media update failed');
          }
        }
      }
      setForm(defaultForm);
      setPendingAvatar(null);
      onOpenChange(false);
      onSuccess();
      toast.success(isEdit ? 'Testimony updated.' : 'Testimony created.');
    } catch (err) {
      console.error(isEdit ? 'Update testimony failed:' : 'Create testimony failed:', err);
      toast.error(err instanceof Error ? err.message : 'Unable to save testimony.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setForm(defaultForm);
      setPendingAvatar(null);
    }
    onOpenChange(val);
  };

  const categorySelectOptions = ensureSelectContainsSlug(categoryOptions, form.category);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit testimony' : 'Create testimony'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update this testimony' : 'Add a new testimony'}
          </DialogDescription>
        </DialogHeader>
        {detailLoading ? (
          <p className="text-sm text-muted-foreground py-4">Loading…</p>
        ) : (
          <form onSubmit={e => void handleSubmit(e)} className="grid gap-4">
            <RegularInput
              label="Author"
              value={form.author}
              onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
              placeholder="Enter author name"
              required
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
            />
            <RegularTextarea
              label="Content"
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Enter testimony content"
              rows={6}
              required
            />
            <MediaUrlOrUploadField
              label="Avatar"
              value={form.avatar}
              onChange={value => setForm(f => ({ ...f, avatar: value }))}
              entityType="testimony"
              entityId={editId}
              fallbackEntityIdPrefix="testimony-avatar"
              intent="image"
              accept="image/*"
              defaultMode="upload"
              onPendingFileChange={setPendingAvatar}
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
                  disabled={!form.author.trim() || !form.content.trim()}
                />
              ) : (
                <>
                  <RegularBtn
                    type="button"
                    text="Create as draft"
                    loading={loading}
                    onClick={() => void handleSubmit(undefined, 'draft')}
                    disabled={!form.author.trim() || !form.content.trim() || loading}
                  />
                  <RegularBtn
                    type="button"
                    text="Create & publish"
                    loading={loading}
                    onClick={() => void handleSubmit(undefined, 'published')}
                    disabled={!form.author.trim() || !form.content.trim() || loading}
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
