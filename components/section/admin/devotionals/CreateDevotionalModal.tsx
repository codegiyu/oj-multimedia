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
import { DEVOTIONAL_TYPES } from '@/lib/types/community';
import { AdminUserAccountPicker } from '@/components/section/admin/shared/AdminUserAccountPicker';

interface CreateDevotionalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function CreateDevotionalModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateDevotionalModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

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
      if (form.ownerUserId) payload.ownerUserId = form.ownerUserId;

      const res = await callApi('ADMIN_DEVOTIONAL_CREATE', { payload });
      if (res.type !== 'success') throw new Error(res.error?.message ?? 'Create failed');
      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error('Create devotional failed:', err);
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
          <DialogTitle>Create Devotional</DialogTitle>
          <DialogDescription>Add a new devotional</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <AdminUserAccountPicker
            value={form.ownerUserId}
            onChange={(userId, _u) => setForm(f => ({ ...f, ownerUserId: userId }))}
            description="Optional. Links this devotional to a user’s artist profile on the server."
          />
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
          <RegularInput
            label="Category"
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            placeholder="Enter category"
          />
          <RegularInput
            label="Cover image URL"
            value={form.coverImage}
            onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
            placeholder="Featured image URL"
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
              disabled={!form.title.trim()}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
