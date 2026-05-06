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
import {
  ensureSelectContainsSlug,
  loadAdminContentCategorySelectOptions,
} from '@/lib/utils/adminContentCategorySelect';

interface CreateNewsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set while the dialog is open, the form loads this article for editing. */
  editId: string | null;
  onSuccess: () => void;
}

const defaultForm = {
  title: '',
  content: '',
  excerpt: '',
  author: '',
  category: '',
  coverImage: '',
  audioUrl: '',
  videoFileUrl: '',
  embedUrl: '',
  downloadUrl: '',
  isFeatured: false,
  status: 'draft' as 'draft' | 'published' | 'archived',
};

const statusOptions: SelectOption[] = [
  { text: 'Draft', value: 'draft' },
  { text: 'Published', value: 'published' },
  { text: 'Archived', value: 'archived' },
];

export function CreateNewsModal({ open, onOpenChange, editId, onSuccess }: CreateNewsModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([
    { text: 'None', value: '' },
  ]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const isEdit = Boolean(editId);

  useEffect(() => {
    if (!open) return;
    setCategoriesLoading(true);
    void loadAdminContentCategorySelectOptions('news')
      .then(opts => setCategoryOptions(opts))
      .finally(() => setCategoriesLoading(false));
  }, [open]);

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
        const res = await callApi('ADMIN_NEWS_ITEM', {
          query: `/${editId}` as `/${string}`,
        });
        if (cancelled || res.type !== 'success' || !res.data.news) return;
        const n = res.data.news;
        setCategoryOptions(prev => ensureSelectContainsSlug(prev, n.category ?? undefined));
        setForm({
          title: n.title ?? '',
          content: n.content ?? '',
          excerpt: n.excerpt ?? '',
          author: n.author ?? '',
          category: n.category ?? '',
          coverImage: n.coverImage ?? '',
          audioUrl: n.audioUrl ?? '',
          videoFileUrl: n.videoFileUrl ?? '',
          embedUrl: n.embedUrl ?? '',
          downloadUrl: n.downloadUrl ?? '',
          status: n.status ?? 'draft',
          isFeatured: n.isFeatured ?? false,
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
        const res = await callApi('ADMIN_NEWS_UPDATE', {
          query: `/${editId}` as `/${string}`,
          payload: {
            title: form.title.trim(),
            content: form.content,
            excerpt: form.excerpt || undefined,
            author: form.author || undefined,
            category: form.category?.trim() || undefined,
            coverImage: form.coverImage?.trim() || undefined,
            audioUrl: form.audioUrl?.trim() || undefined,
            videoFileUrl: form.videoFileUrl?.trim() || undefined,
            embedUrl: form.embedUrl?.trim() || undefined,
            downloadUrl: form.downloadUrl?.trim() || undefined,
            status: form.status,
            isFeatured: form.isFeatured,
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        const { error } = await callApi('ADMIN_NEWS_CREATE', {
          payload: {
            title: form.title.trim(),
            content: form.content?.trim() ?? '',
            excerpt: form.excerpt?.trim() ?? '',
            author: form.author?.trim() || undefined,
            category: form.category?.trim() || undefined,
            coverImage: form.coverImage?.trim() || undefined,
            audioUrl: form.audioUrl?.trim() || undefined,
            videoFileUrl: form.videoFileUrl?.trim() || undefined,
            embedUrl: form.embedUrl?.trim() || undefined,
            downloadUrl: form.downloadUrl?.trim() || undefined,
            isFeatured: form.isFeatured,
            status: form.status,
          },
        });
        if (error) throw new Error(error.message);
      }
      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
    } catch (err) {
      console.error(isEdit ? 'Update news failed:' : 'Create news failed:', err);
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
          <DialogTitle>{isEdit ? 'Edit news article' : 'Create news article'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update this article' : 'Add a new news article'}
          </DialogDescription>
        </DialogHeader>
        {detailLoading ? (
          <p className="text-sm text-muted-foreground py-4">Loading article…</p>
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
              label="Status"
              value={form.status}
              onSelectChange={v => setForm(f => ({ ...f, status: v as typeof form.status }))}
              options={statusOptions}
            />
            <RegularInput
              label="Author"
              value={form.author}
              onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
            />
            <RegularSelect
              label="Category"
              value={form.category}
              onSelectChange={v => setForm(f => ({ ...f, category: v }))}
              options={categorySelectOptions}
              loading={categoriesLoading}
            />
            <RegularInput
              label="Cover image URL"
              value={form.coverImage}
              onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
            />
            <RegularSelect
              label="Featured"
              value={form.isFeatured ? 'yes' : 'no'}
              onSelectChange={v => setForm(f => ({ ...f, isFeatured: v === 'yes' }))}
              options={[
                { text: 'No', value: 'no' },
                { text: 'Yes', value: 'yes' },
              ]}
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
            <RegularInput
              label="Audio URL"
              value={form.audioUrl}
              onChange={e => setForm(f => ({ ...f, audioUrl: e.target.value }))}
            />
            <RegularInput
              label="Video file URL"
              value={form.videoFileUrl}
              onChange={e => setForm(f => ({ ...f, videoFileUrl: e.target.value }))}
            />
            <RegularInput
              label="Embed URL"
              value={form.embedUrl}
              onChange={e => setForm(f => ({ ...f, embedUrl: e.target.value }))}
            />
            <RegularInput
              label="Download URL"
              value={form.downloadUrl}
              onChange={e => setForm(f => ({ ...f, downloadUrl: e.target.value }))}
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
