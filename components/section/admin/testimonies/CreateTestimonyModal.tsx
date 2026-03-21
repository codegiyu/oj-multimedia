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
import { RegularSelect } from '@/components/atoms/RegularSelect';
import type { SelectOption } from '@/lib/types/general';
import { callApi } from '@/lib/services/callApi';

interface CreateTestimonyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function CreateTestimonyModal({ open, onOpenChange, onSuccess }: CreateTestimonyModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author.trim() || !form.content.trim()) return;
    setLoading(true);
    try {
      const { error } = await callApi('ADMIN_TESTIMONY_CREATE', {
        payload: {
          author: form.author.trim(),
          content: form.content.trim(),
          category: form.category?.trim() || undefined,
          status: form.status,
        },
      });
      if (error) throw new Error(error.message);
      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Create testimony failed:', err);
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
          <DialogTitle>Create Testimony</DialogTitle>
          <DialogDescription>Add a new testimony</DialogDescription>
        </DialogHeader>
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
          <RegularInput
            label="Category"
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            placeholder="Enter category"
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
              text="Create"
              loading={loading}
              disabled={!form.author.trim() || !form.content.trim()}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
