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
import { TESTIMONY_CATEGORY_SELECT_OPTIONS } from '@/lib/constants/communityCategorySelectOptions';
import {
  PUBLISHABLE_STATUS_SELECT_OPTIONS,
  PUBLISHABLE_STATUS_VALUES,
} from '@/lib/constants/adminSelectOptions';
import { ensureSelectContainsSlug } from '@/lib/utils/adminContentCategorySelect';
import {
  normalizeEnumValue,
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

  const isEdit = Boolean(editId);

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setCategoryOptions(baseCategoryOptions);
      return;
    }
    if (!editId) {
      setForm(defaultForm);
      setCategoryOptions(baseCategoryOptions);
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

      if (editId) {
        const res = await callApi('ADMIN_TESTIMONY_UPDATE', {
          query: `/${editId}` as `/${string}`,
          payload: {
            author,
            content,
            category,
            status: form.status,
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        const { error } = await callApi('ADMIN_TESTIMONY_CREATE', {
          payload: {
            author,
            content,
            category,
            status: createStatus,
          },
        });
        if (error) throw new Error(error.message);
      }
      setForm(defaultForm);
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
    if (!val) setForm(defaultForm);
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
