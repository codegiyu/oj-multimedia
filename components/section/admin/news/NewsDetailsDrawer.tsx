'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { format } from 'date-fns';
import { Newspaper, FileText, Calendar, Hash } from 'lucide-react';
import type { PublicNewsListItem } from '@/lib/constants/endpoints';
import { InfoCard } from '@/components/general/InfoCard';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import type { SelectOption } from '@/lib/types/general';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';

const statusOptions: SelectOption[] = [
  { text: 'Draft', value: 'draft' },
  { text: 'Published', value: 'published' },
  { text: 'Archived', value: 'archived' },
];

function DetailsHeader({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<PublicNewsListItem, string>;
}) {
  const newsItem = rowDetails.data;
  return (
    <div className="flex gap-3 items-center">
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          {newsItem.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {newsItem.status ?? '—'} ·{' '}
          {newsItem.createdAt ? format(new Date(newsItem.createdAt), 'MMM d, yyyy') : '—'}
        </p>
      </div>
    </div>
  );
}

function DetailsReadOnly({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<PublicNewsListItem, string>;
}) {
  const n = rowDetails.data;
  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={Newspaper} label="Title" value={n.title} />
        <InfoCard icon={FileText} label="Author" value={n.author ?? '—'} />
        <InfoCard icon={FileText} label="Category" value={n.category ?? '—'} />
        <InfoCard icon={FileText} label="Status" value={n.status ?? '—'} />
        <InfoCard icon={FileText} label="Excerpt" value={n.excerpt ?? '—'} />
        <InfoCard
          icon={FileText}
          label="Content"
          value={n.content ?? '—'}
          className="[&_.line-clamp-1]:line-clamp-none"
        />
        <InfoCard icon={FileText} label="Cover URL" value={n.coverImage ?? '—'} />
        <InfoCard icon={FileText} label="Audio URL" value={n.audioUrl ?? '—'} />
        <InfoCard icon={FileText} label="Video file URL" value={n.videoFileUrl ?? '—'} />
        <InfoCard icon={FileText} label="Embed URL" value={n.embedUrl ?? '—'} />
        <InfoCard icon={FileText} label="Download URL" value={n.downloadUrl ?? '—'} />
        <InfoCard
          icon={Calendar}
          label="Created"
          value={n.createdAt ? format(new Date(n.createdAt), 'MMM d, yyyy HH:mm:ss') : '—'}
        />
        <InfoCard
          icon={Calendar}
          label="Updated"
          value={n.updatedAt ? format(new Date(n.updatedAt), 'MMM d, yyyy HH:mm:ss') : '—'}
        />
        <InfoCard icon={Hash} label="ID" value={n._id} hasCopy copyValue={n._id} />
      </div>
    </div>
  );
}

interface NewsDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<PublicNewsListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<PublicNewsListItem, string> | undefined) => void;
  onSaved: () => void;
}

type NewsEditForm = {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  coverImage: string;
  audioUrl: string;
  videoFileUrl: string;
  embedUrl: string;
  downloadUrl: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
};

export function NewsDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
  onSaved,
}: NewsDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);
  const isEdit = clickedRowDetails?.index === -1;
  const rowId = clickedRowDetails?.data._id;

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<NewsEditForm>({
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
    status: 'draft',
    isFeatured: false,
  });

  const loadDetail = useCallback(async () => {
    if (!rowId) return;
    setLoadingDetail(true);
    try {
      const res = await callApi('ADMIN_NEWS_ITEM', {
        query: `/${rowId}` as `/${string}`,
      });
      if (res.type !== 'success' || !res.data.news) return;
      const n = res.data.news;
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
      setLoadingDetail(false);
    }
  }, [rowId]);

  useEffect(() => {
    if (clickedRowDetails && isEdit && rowId) {
      void loadDetail();
    }
  }, [clickedRowDetails, isEdit, rowId, loadDetail]);

  const handleSave = async () => {
    if (!rowId || !form.title.trim()) return;
    setSaving(true);
    try {
      const res = await callApi('ADMIN_NEWS_UPDATE', {
        query: `/${rowId}` as `/${string}`,
        payload: {
          title: form.title.trim(),
          content: form.content,
          excerpt: form.excerpt || undefined,
          author: form.author || undefined,
          category: form.category || undefined,
          coverImage: form.coverImage || undefined,
          audioUrl: form.audioUrl || undefined,
          videoFileUrl: form.videoFileUrl || undefined,
          embedUrl: form.embedUrl || undefined,
          downloadUrl: form.downloadUrl || undefined,
          status: form.status,
          isFeatured: form.isFeatured,
        },
      });
      if (res.type !== 'success') throw new Error(res.error?.message ?? 'Update failed');
      onSaved();
      closeDrawer();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (!clickedRowDetails) return null;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title={isEdit ? 'Edit article' : 'News article details'}
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="news article"
      showMeta={false}
      setShowMeta={() => {}}
      header={<DetailsHeader rowDetails={clickedRowDetails} />}
      footer={
        isEdit ? (
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-foreground/7">
            <RegularBtn
              type="button"
              text="Cancel"
              variant="ghost"
              onClick={closeDrawer}
              disabled={saving}
            />
            <RegularBtn
              type="button"
              text="Save"
              loading={saving}
              disabled={saving || loadingDetail || !form.title.trim()}
              onClick={() => void handleSave()}
            />
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-foreground/7" />
        )
      }>
      {isEdit ? (
        <div className="grid gap-4 p-4 max-h-[70vh] overflow-y-auto sleek-scrollbar">
          {loadingDetail ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <>
              <RegularInput
                label="Title"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
              <RegularSelect
                label="Status"
                value={form.status}
                onSelectChange={v => setForm(f => ({ ...f, status: v as NewsEditForm['status'] }))}
                options={statusOptions}
              />
              <RegularInput
                label="Author"
                value={form.author}
                onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
              />
              <RegularInput
                label="Category"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              />
              <RegularInput
                label="Cover image URL"
                value={form.coverImage}
                onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
              />
              <RegularInput
                label="Excerpt"
                value={form.excerpt}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              />
              <RegularTextarea
                label="Content"
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={6}
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
              <RegularSelect
                label="Featured"
                value={form.isFeatured ? 'yes' : 'no'}
                onSelectChange={v => setForm(f => ({ ...f, isFeatured: v === 'yes' }))}
                options={[
                  { text: 'No', value: 'no' },
                  { text: 'Yes', value: 'yes' },
                ]}
              />
            </>
          )}
        </div>
      ) : (
        <DetailsReadOnly rowDetails={clickedRowDetails} />
      )}
    </TableRowDetails>
  );
}
