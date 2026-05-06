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
import { RESOURCE_TYPES } from '@/lib/types/community';

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
};

const statusOptions: SelectOption[] = [
  { text: 'Draft', value: 'draft' },
  { text: 'Published', value: 'published' },
  { text: 'Archived', value: 'archived' },
];

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

  const isEdit = Boolean(editId);

  useEffect(() => {
    if (!open) {
      setForm(defaultForm);
      return;
    }
    if (!editId) {
      setForm(defaultForm);
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
          type: (r.type as (typeof RESOURCE_TYPES)[number]) ?? 'ebook',
          category: r.category ?? '',
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
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      if (editId) {
        const res = await callApi('ADMIN_RESOURCE_UPDATE', {
          query: `/${editId}` as `/${string}`,
          payload: {
            title: form.title.trim(),
            description: form.description?.trim() ?? '',
            type: form.type,
            category: form.category?.trim() || undefined,
            status: form.status,
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        const { error } = await callApi('ADMIN_RESOURCE_CREATE', {
          payload: {
            title: form.title.trim(),
            description: form.description?.trim() ?? '',
            type: form.type,
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
      console.error(isEdit ? 'Update resource failed:' : 'Create resource failed:', err);
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
      <DialogContent className="max-w-xl" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit resource' : 'Create resource'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update this resource' : 'Add a new resource'}
          </DialogDescription>
        </DialogHeader>
        {detailLoading ? (
          <p className="text-sm text-muted-foreground py-4">Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
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
              label="Category"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              placeholder="Enter category"
            />
            <RegularTextarea
              label="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Enter description"
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
                text={isEdit ? 'Save' : 'Create'}
                loading={loading}
                disabled={!form.title.trim()}
              />
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
