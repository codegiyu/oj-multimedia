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
import { MediaUrlOrUploadField } from '@/components/general/MediaUrlOrUploadField';
import { useFileUpload } from '@/lib/hooks/use-file-upload';
import {
  PUBLISHABLE_STATUS_SELECT_OPTIONS,
  PUBLISHABLE_STATUS_VALUES,
} from '@/lib/constants/adminSelectOptions';
import type { SelectOption } from '@/lib/types/general';
import { callApi } from '@/lib/services/callApi';
import { toast } from 'sonner';
import {
  ensureSelectContainsSlug,
  loadAdminContentCategorySelectOptions,
} from '@/lib/utils/adminContentCategorySelect';
import {
  normalizeEnumValue,
  normalizeOptionalHttpUrl,
  normalizeOptionalText,
  requireText,
} from '@/lib/utils/adminFormValidation';

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

export function CreateNewsModal({ open, onOpenChange, editId, onSuccess }: CreateNewsModalProps) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([
    { text: 'None', value: '' },
  ]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [pendingCoverImage, setPendingCoverImage] = useState<File | null>(null);
  const [pendingAudio, setPendingAudio] = useState<File | null>(null);
  const [pendingVideoFile, setPendingVideoFile] = useState<File | null>(null);

  const isEdit = Boolean(editId);
  const coverUpload = useFileUpload({
    entityType: 'news-article',
    entityId: editId ?? 'news-pending',
    intent: 'image',
  });
  const audioUpload = useFileUpload({
    entityType: 'news-article',
    entityId: editId ?? 'news-pending',
    intent: 'other',
  });
  const videoUpload = useFileUpload({
    entityType: 'news-article',
    entityId: editId ?? 'news-pending',
    intent: 'other',
  });

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
          status: normalizeEnumValue(n.status, PUBLISHABLE_STATUS_VALUES, 'draft'),
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
    setLoading(true);
    try {
      const title = requireText(form.title, 'Title');
      const content = form.content.trim();
      const excerpt = normalizeOptionalText(form.excerpt);
      const author = normalizeOptionalText(form.author);
      const category = normalizeOptionalText(form.category);
      const coverImage = normalizeOptionalHttpUrl(form.coverImage, 'Cover image URL');
      const audioUrl = normalizeOptionalHttpUrl(form.audioUrl, 'Audio URL');
      const videoFileUrl = normalizeOptionalHttpUrl(form.videoFileUrl, 'Video file URL');
      const embedUrl = normalizeOptionalHttpUrl(form.embedUrl, 'Embed URL');
      const downloadUrl = normalizeOptionalHttpUrl(form.downloadUrl, 'Download URL');
      let finalCoverImage = coverImage;
      let finalAudioUrl = audioUrl;
      let finalVideoFileUrl = videoFileUrl;
      const finalDownloadUrl = downloadUrl;

      if (editId) {
        if (pendingCoverImage) {
          const upload = await coverUpload.uploadFile({
            file: pendingCoverImage,
            entityId: editId,
          });
          if (!upload?.url) throw new Error('Cover image upload failed');
          finalCoverImage = upload.url;
        }
        if (pendingAudio) {
          const upload = await audioUpload.uploadFile({ file: pendingAudio, entityId: editId });
          if (!upload?.url) throw new Error('Audio upload failed');
          finalAudioUrl = upload.url;
        }
        if (pendingVideoFile) {
          const upload = await videoUpload.uploadFile({ file: pendingVideoFile, entityId: editId });
          if (!upload?.url) throw new Error('Video upload failed');
          finalVideoFileUrl = upload.url;
        }
        const res = await callApi('ADMIN_NEWS_UPDATE', {
          query: `/${editId}` as `/${string}`,
          payload: {
            title,
            content,
            excerpt,
            author,
            category,
            coverImage: finalCoverImage,
            audioUrl: finalAudioUrl,
            videoFileUrl: finalVideoFileUrl,
            embedUrl,
            downloadUrl: finalDownloadUrl,
            status: form.status,
            isFeatured: form.isFeatured,
          },
        });
        if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      } else {
        const createRes = await callApi('ADMIN_NEWS_CREATE', {
          payload: {
            title,
            content,
            excerpt: excerpt ?? '',
            author,
            category,
            coverImage: finalCoverImage || '',
            audioUrl: finalAudioUrl || '',
            videoFileUrl: finalVideoFileUrl || '',
            embedUrl,
            downloadUrl: finalDownloadUrl,
            isFeatured: form.isFeatured,
            status: form.status,
          },
        });
        if (createRes.type !== 'success')
          throw new Error(createRes.error?.message ?? 'Create failed');
        const createdId =
          (
            createRes.data as
              | { news?: { _id?: string }; article?: { _id?: string }; _id?: string }
              | undefined
          )?.news?._id ??
          (createRes.data as { article?: { _id?: string } } | undefined)?.article?._id ??
          (createRes.data as { _id?: string } | undefined)?._id;
        if (createdId) {
          if (pendingCoverImage) {
            const upload = await coverUpload.uploadFile({
              file: pendingCoverImage,
              entityId: createdId,
            });
            if (upload?.url) finalCoverImage = upload.url;
          }
          if (pendingAudio) {
            const upload = await audioUpload.uploadFile({
              file: pendingAudio,
              entityId: createdId,
            });
            if (upload?.url) finalAudioUrl = upload.url;
          }
          if (pendingVideoFile) {
            const upload = await videoUpload.uploadFile({
              file: pendingVideoFile,
              entityId: createdId,
            });
            if (upload?.url) finalVideoFileUrl = upload.url;
          }
          if (pendingCoverImage || pendingAudio || pendingVideoFile) {
            const patchRes = await callApi('ADMIN_NEWS_UPDATE', {
              query: `/${createdId}` as `/${string}`,
              payload: {
                coverImage: finalCoverImage,
                audioUrl: finalAudioUrl,
                videoFileUrl: finalVideoFileUrl,
              },
            });
            if (patchRes.type !== 'success')
              throw new Error(patchRes.error?.message ?? 'Post-create media update failed');
          }
        }
      }
      setForm(defaultForm);
      onOpenChange(false);
      onSuccess();
      toast.success(isEdit ? 'News article updated.' : 'News article created.');
    } catch (err) {
      console.error(isEdit ? 'Update news failed:' : 'Create news failed:', err);
      toast.error(err instanceof Error ? err.message : 'Unable to save news article.');
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" showCloseButton={!loading}>
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
              onSelectChange={v =>
                setForm(f => ({
                  ...f,
                  status: normalizeEnumValue(v, PUBLISHABLE_STATUS_VALUES, 'draft'),
                }))
              }
              options={[...PUBLISHABLE_STATUS_SELECT_OPTIONS] as SelectOption[]}
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
            <MediaUrlOrUploadField
              label="Cover image URL"
              value={form.coverImage}
              onChange={value => setForm(f => ({ ...f, coverImage: value }))}
              entityType="news-article"
              entityId={editId}
              fallbackEntityIdPrefix="news-cover"
              intent="image"
              accept="image/*"
              defaultMode="upload"
              onPendingFileChange={setPendingCoverImage}
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
            <MediaUrlOrUploadField
              label="Audio URL"
              value={form.audioUrl}
              onChange={value => setForm(f => ({ ...f, audioUrl: value }))}
              entityType="news-article"
              entityId={editId}
              fallbackEntityIdPrefix="news-audio"
              intent="other"
              accept="audio/*"
              onPendingFileChange={setPendingAudio}
            />
            <MediaUrlOrUploadField
              label="Video file URL"
              value={form.videoFileUrl}
              onChange={value => setForm(f => ({ ...f, videoFileUrl: value }))}
              entityType="news-article"
              entityId={editId}
              fallbackEntityIdPrefix="news-video"
              intent="other"
              accept="video/*"
              onPendingFileChange={setPendingVideoFile}
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
