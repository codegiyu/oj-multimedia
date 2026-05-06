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
import { POLL_CATEGORY_SELECT_OPTIONS } from '@/lib/constants/communityCategorySelectOptions';
import { ensureSelectContainsSlug } from '@/lib/utils/adminContentCategorySelect';

interface CreatePollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId: string | null;
  onSuccess: () => void;
}

const defaultForm = {
  question: '',
  description: '',
  category: '',
  options: ['', ''],
};

const basePollCategoryOptions: SelectOption[] = [
  { text: 'None', value: '' },
  ...POLL_CATEGORY_SELECT_OPTIONS,
];

export function CreatePollModal({ open, onOpenChange, editId, onSuccess }: CreatePollModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>(basePollCategoryOptions);

  const isEdit = Boolean(editId);

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      setCategoryOptions(basePollCategoryOptions);
      return;
    }
    if (!editId) {
      setForm(defaultForm);
      setCategoryOptions(basePollCategoryOptions);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    void (async () => {
      try {
        const res = await callApi('ADMIN_POLL_ITEM', {
          query: `/${editId}` as `/${string}`,
        });
        if (cancelled || res.type !== 'success' || !res.data.poll) return;
        const p = res.data.poll;
        const cat = p.category ?? '';
        setCategoryOptions(ensureSelectContainsSlug(basePollCategoryOptions, cat || undefined));
        setForm({
          question: p.question ?? '',
          description: p.description ?? '',
          category: cat,
          options: p.options?.length ? p.options.map(o => o.text) : ['', ''],
        });
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, editId]);

  const addOption = () => {
    setForm(f => ({ ...f, options: [...f.options, ''] }));
  };

  const updateOption = (index: number, value: string) => {
    setForm(f => ({
      ...f,
      options: f.options.map((o, i) => (i === index ? value : o)),
    }));
  };

  const removeOption = (index: number) => {
    if (form.options.length <= 2) return;
    setForm(f => ({ ...f, options: f.options.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedOptions = form.options.map(o => o.trim()).filter(Boolean);
    if (!form.question.trim() || trimmedOptions.length < 2) return;
    setLoading(true);
    try {
      if (editId) {
        const res = await callApi('ADMIN_POLL_UPDATE', {
          query: `/${editId}` as `/${string}`,
          payload: {
            question: form.question.trim(),
            description: form.description?.trim() || undefined,
            category: form.category?.trim() || undefined,
            options: trimmedOptions,
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        const { error } = await callApi('ADMIN_POLL_CREATE', {
          payload: {
            question: form.question.trim(),
            description: form.description?.trim() || undefined,
            category: form.category?.trim() || undefined,
            options: trimmedOptions,
          },
        });
        if (error) throw new Error(error.message);
      }
      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error(isEdit ? 'Update poll failed:' : 'Create poll failed:', err);
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
          <DialogTitle>{isEdit ? 'Edit poll' : 'Create poll'}</DialogTitle>
          <DialogDescription>{isEdit ? 'Update this poll' : 'Add a new poll'}</DialogDescription>
        </DialogHeader>
        {detailLoading ? (
          <p className="text-sm text-muted-foreground py-4">Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <RegularInput
              label="Question"
              value={form.question}
              onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
              placeholder="Enter poll question"
              required
            />
            <RegularTextarea
              label="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Optional description"
              rows={2}
            />
            <RegularSelect
              label="Category"
              value={form.category}
              onSelectChange={v => setForm(f => ({ ...f, category: v }))}
              options={categorySelectOptions}
            />
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Options</span>
                <RegularBtn
                  type="button"
                  text="Add Option"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                />
              </div>
              {form.options.map((opt, idx) => (
                <div key={idx} className="flex gap-2">
                  <RegularInput
                    label=""
                    value={opt}
                    onChange={e => updateOption(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                  />
                  <RegularBtn
                    type="button"
                    text="Remove"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(idx)}
                    disabled={form.options.length <= 2}
                    className="self-end"
                  />
                </div>
              ))}
            </div>
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
                disabled={!form.question.trim() || form.options.filter(o => o.trim()).length < 2}
              />
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
