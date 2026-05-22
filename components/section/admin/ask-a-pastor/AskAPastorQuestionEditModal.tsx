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
import { ASK_A_PASTOR_CATEGORY_SELECT_OPTIONS } from '@/lib/constants/communityCategorySelectOptions';
import {
  PRAYER_REQUEST_STATUS_SELECT_OPTIONS,
  PRAYER_REQUEST_STATUS_VALUES,
} from '@/lib/constants/adminSelectOptions';
import { ensureSelectContainsSlug } from '@/lib/utils/adminContentCategorySelect';
import { normalizeEnumValue } from '@/lib/utils/adminFormValidation';

interface AskAPastorQuestionEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionId: string | null;
  onSuccess: () => void;
}

const baseCategoryOptions: SelectOption[] = [
  { text: 'None', value: '' },
  ...ASK_A_PASTOR_CATEGORY_SELECT_OPTIONS,
];

export function AskAPastorQuestionEditModal({
  open,
  onOpenChange,
  questionId,
  onSuccess,
}: AskAPastorQuestionEditModalProps) {
  const [question, setQuestion] = useState('');
  const [author, setAuthor] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>(baseCategoryOptions);

  useEffect(() => {
    if (!open || !questionId) {
      setQuestion('');
      setAuthor('');
      setAnswer('');
      setCategory('');
      setStatus('active');
      setCategoryOptions(baseCategoryOptions);
      return;
    }

    let cancelled = false;
    setDetailLoading(true);

    void (async () => {
      try {
        const res = await callApi('ADMIN_ASK_PASTOR_ITEM', {
          query: `/${questionId}` as `/${string}`,
        });
        if (cancelled || res.type !== 'success' || !res.data.question) return;
        const q = res.data.question;
        setCategoryOptions(ensureSelectContainsSlug(baseCategoryOptions, q.category ?? undefined));
        setQuestion(q.question ?? '');
        setAuthor(q.author ?? '');
        setAnswer(q.answer ?? '');
        setCategory(q.category ?? '');
        setStatus(normalizeEnumValue(q.status, PRAYER_REQUEST_STATUS_VALUES, 'active'));
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, questionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionId || !question.trim() || !author.trim()) return;
    setLoading(true);
    try {
      const res = await callApi('ADMIN_ASK_PASTOR_UPDATE', {
        query: `/${questionId}` as `/${string}`,
        payload: {
          question: question.trim(),
          author: author.trim(),
          answer: answer.trim() || undefined,
          category: category.trim() || undefined,
          status,
        },
      });
      if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Update question failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const categorySelectOptions = ensureSelectContainsSlug(categoryOptions, category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Edit question</DialogTitle>
          <DialogDescription>
            Update question text, author, answer, category, or status.
          </DialogDescription>
        </DialogHeader>
        {detailLoading ? (
          <p className="text-sm text-muted-foreground py-4">Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <RegularInput
              label="Author"
              value={author}
              onChange={e => setAuthor(e.target.value)}
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
              label="Question"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              rows={4}
              required
            />
            <RegularTextarea
              label="Answer (optional)"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              rows={6}
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
                disabled={!question.trim() || !author.trim()}
              />
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
