/* eslint-disable react-hooks/exhaustive-deps */
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
import { TESTIMONY_CATEGORY_SELECT_OPTIONS } from '@/lib/constants/communityCategorySelectOptions';
import { ensureSelectContainsSlug } from '@/lib/utils/adminContentCategorySelect';

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

const statusOptions: SelectOption[] = [
  { text: 'Draft', value: 'draft' },
  { text: 'Published', value: 'published' },
  { text: 'Archived', value: 'archived' },
];

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
          status: (st as typeof form.status) ?? 'draft',
        });
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
    if (!form.author.trim() || !form.content.trim()) return;
    setLoading(true);
    try {
      if (editId) {
        const res = await callApi('ADMIN_TESTIMONY_UPDATE', {
          query: `/${editId}` as `/${string}`,
          payload: {
            author: form.author.trim(),
            content: form.content.trim(),
            category: form.category?.trim() || undefined,
            status: form.status,
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        const { error } = await callApi('ADMIN_TESTIMONY_CREATE', {
          payload: {
            author: form.author.trim(),
            content: form.content.trim(),
            category: form.category?.trim() || undefined,
            status: form.status,
          },
        });
        if (error) throw new Error(error.message);
      }
      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error(isEdit ? 'Update testimony failed:' : 'Create testimony failed:', err);
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
      <DialogContent className="max-w-xl" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit testimony' : 'Create testimony'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update this testimony' : 'Add a new testimony'}
          </DialogDescription>
        </DialogHeader>
        {detailLoading ? (
          <p className="text-sm text-muted-foreground py-4">Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <RegularInput
              label="Author"
              value={form.author}
              onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
              placeholder="Enter author name"
              required
            />
            <RegularSelect
              label="Status"
              value={form.status}
              onSelectChange={v => setForm(f => ({ ...f, status: v as typeof form.status }))}
              options={statusOptions}
            />
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
              <RegularBtn
                type="submit"
                text={isEdit ? 'Save' : 'Create'}
                loading={loading}
                disabled={!form.author.trim() || !form.content.trim()}
              />
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
