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
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { parseCommaSeparatedTags, formatTagsForInput } from '@/lib/utils/adminCommaTags';

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
  priority: 1,
  tags: '',
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
  const [priorityHelpOpen, setPriorityHelpOpen] = useState(false);

  const isEdit = Boolean(editId);
  const canPublish = Boolean(form.category.trim()) && Boolean(form.content.trim());
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
          priority:
            typeof (n as { priority?: number }).priority === 'number'
              ? (n as { priority: number }).priority
              : 1,
          tags: formatTagsForInput((n as { tags?: string[] }).tags),
        });
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, editId]);

  const handleSubmit = async (
    e?: React.FormEvent<HTMLFormElement>,
    createStatus: 'draft' | 'published' = 'draft'
  ) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const title = requireText(form.title, 'Title');
      const content = form.content.trim();
      const excerpt = normalizeOptionalText(form.excerpt);
      const author = normalizeOptionalText(form.author);
      const category = form.category ?? '';
      const tags = parseCommaSeparatedTags(form.tags);
      const priority = form.priority;
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
            tags,
            priority,
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
            tags,
            priority,
            coverImage: finalCoverImage || '',
            audioUrl: finalAudioUrl || '',
            videoFileUrl: finalVideoFileUrl || '',
            embedUrl,
            downloadUrl: finalDownloadUrl,
            isFeatured: form.isFeatured,
            status: createStatus,
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
          <form onSubmit={e => void handleSubmit(e)} className="grid gap-4">
            <RegularInput
              label="Title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Enter title"
              required
            />
            {isEdit ? (
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
            ) : null}
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
              subtext="Required when publishing. Choose None to save as draft without a category."
            />
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="news-priority">Priority (1–5)</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-muted-foreground"
                  onClick={() => setPriorityHelpOpen(true)}>
                  <Info className="w-4 h-4" />
                  About breaking news
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Slider
                  id="news-priority"
                  min={1}
                  max={5}
                  step={1}
                  value={form.priority}
                  onValueChange={v => setForm(f => ({ ...f, priority: v }))}
                  className="flex-1"
                />
                <span className="text-sm font-medium tabular-nums w-6 text-center">
                  {form.priority}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Levels 4–5 appear in Breaking News for about 7 days.
              </p>
            </div>
            <Dialog open={priorityHelpOpen} onOpenChange={setPriorityHelpOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>News priority</DialogTitle>
                  <DialogDescription>
                    Priority controls breaking-news placement and feed emphasis.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>1–3:</strong> Standard to elevated coverage in regular feeds.
                  </p>
                  <p>
                    <strong>4–5:</strong> Breaking news — shown in the Breaking News rail and
                    listing while the story is recent (about one week).
                  </p>
                  <p>Use priority 5 for urgent ministry or community announcements.</p>
                </div>
              </DialogContent>
            </Dialog>
            <RegularInput
              label="Tags"
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="e.g. announcement, event, worship"
              bottomText="Separate tags with commas"
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
              {isEdit ? (
                <RegularBtn
                  type="submit"
                  text="Save"
                  loading={loading}
                  disabled={!form.title.trim()}
                />
              ) : (
                <>
                  <RegularBtn
                    type="button"
                    text="Create as draft"
                    loading={loading}
                    onClick={() => void handleSubmit(undefined, 'draft')}
                    disabled={!form.title.trim() || loading}
                  />
                  <RegularBtn
                    type="button"
                    text="Create & publish"
                    loading={loading}
                    onClick={() => void handleSubmit(undefined, 'published')}
                    disabled={!form.title.trim() || !canPublish || loading}
                  />
                </>
              )}
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
