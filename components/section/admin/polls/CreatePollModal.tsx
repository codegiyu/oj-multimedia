'use client';

import { useState } from 'react';
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
import { callApi } from '@/lib/services/callApi';

interface CreatePollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const defaultForm = {
  question: '',
  description: '',
  options: ['', ''],
};

export function CreatePollModal({ open, onOpenChange, onSuccess }: CreatePollModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

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
      const { error } = await callApi('ADMIN_POLL_CREATE', {
        payload: {
          question: form.question.trim(),
          description: form.description?.trim() || undefined,
          options: trimmedOptions,
        },
      });
      if (error) throw new Error(error.message);
      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Create poll failed:', err);
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
      <DialogContent className="max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Create Poll</DialogTitle>
          <DialogDescription>Add a new poll</DialogDescription>
        </DialogHeader>
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
              text="Create"
              loading={loading}
              disabled={!form.question.trim() || form.options.filter(o => o.trim()).length < 2}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
