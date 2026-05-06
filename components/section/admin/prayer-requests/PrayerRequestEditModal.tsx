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
import { PRAYER_CATEGORY_SELECT_OPTIONS } from '@/lib/constants/communityCategorySelectOptions';
import {
  PRAYER_REQUEST_STATUS_SELECT_OPTIONS,
  PRAYER_REQUEST_STATUS_VALUES,
} from '@/lib/constants/adminSelectOptions';
import { ensureSelectContainsSlug } from '@/lib/utils/adminContentCategorySelect';
import { normalizeEnumValue } from '@/lib/utils/adminFormValidation';

interface PrayerRequestEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prayerRequestId: string | null;
  onSuccess: () => void;
}

const baseCategoryOptions: SelectOption[] = [
  { text: 'None', value: '' },
  ...PRAYER_CATEGORY_SELECT_OPTIONS,
];

export function PrayerRequestEditModal({
  open,
  onOpenChange,
  prayerRequestId,
  onSuccess,
}: PrayerRequestEditModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>(baseCategoryOptions);

  useEffect(() => {
    if (!open || !prayerRequestId) {
      setTitle('');
      setContent('');
      setCategory('');
      setStatus('active');
      setCategoryOptions(baseCategoryOptions);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    void (async () => {
      try {
        const res = await callApi('ADMIN_PRAYER_REQUEST_ITEM', {
          query: `/${prayerRequestId}` as `/${string}`,
        });
        if (cancelled || res.type !== 'success' || !res.data.prayerRequest) return;
        const pr = res.data.prayerRequest;
        setCategoryOptions(ensureSelectContainsSlug(baseCategoryOptions, pr.category ?? undefined));
        setTitle(pr.title ?? '');
        setContent(pr.content ?? '');
        setCategory(pr.category ?? '');
        setStatus(normalizeEnumValue(pr.status, PRAYER_REQUEST_STATUS_VALUES, 'active'));
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, prayerRequestId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerRequestId || !title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      const res = await callApi('ADMIN_PRAYER_REQUEST_UPDATE', {
        query: `/${prayerRequestId}` as `/${string}`,
        payload: {
          title: title.trim(),
          content: content.trim(),
          category: category.trim() || undefined,
          status,
        },
      });
      if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Update prayer request failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const categorySelectOptions = ensureSelectContainsSlug(categoryOptions, category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Edit prayer request</DialogTitle>
          <DialogDescription>Update title, content, category, or status.</DialogDescription>
        </DialogHeader>
        {detailLoading ? (
          <p className="text-sm text-muted-foreground py-4">Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <RegularInput
              label="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <RegularSelect
              label="Status"
              value={status}
              onSelectChange={v =>
                setStatus(normalizeEnumValue(v, PRAYER_REQUEST_STATUS_VALUES, 'active'))
              }
              options={[...PRAYER_REQUEST_STATUS_SELECT_OPTIONS] as SelectOption[]}
            />
            <RegularSelect
              label="Category"
              value={category}
              onSelectChange={setCategory}
              options={categorySelectOptions}
            />
            <RegularTextarea
              label="Content"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={6}
              required
            />
            <DialogFooter>
              <RegularBtn
                type="button"
                text="Cancel"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              />
              <RegularBtn
                type="submit"
                text="Save"
                loading={loading}
                disabled={!title.trim() || !content.trim()}
              />
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
