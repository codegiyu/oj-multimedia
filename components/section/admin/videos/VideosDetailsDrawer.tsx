'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { format } from 'date-fns';
import { Video, User, FileText, Calendar, Hash } from 'lucide-react';
import type {
  ArtistVideoListItem,
  IArtistUpdateVideoPayload,
  IAdminUpdateVideoPayload,
} from '@/lib/constants/endpoints';
import { InfoCard } from '@/components/general/InfoCard';
import { AdminUserAccountPicker } from '@/components/section/admin/shared/AdminUserAccountPicker';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import type { SelectOption } from '@/lib/types/general';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';

function artistName(artist: ArtistVideoListItem['artist']): string {
  if (!artist) return '—';
  return typeof artist === 'string' ? artist : ((artist as { name?: string }).name ?? '—');
}

const statusOptions: SelectOption[] = [
  { text: 'Draft', value: 'draft' },
  { text: 'Published', value: 'published' },
  { text: 'Archived', value: 'archived' },
];

function DetailsHeader({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<ArtistVideoListItem, string>;
}) {
  const video = rowDetails.data;
  return (
    <div className="flex gap-3 items-center">
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          {video.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {artistName(video.artist)} · {video.status ?? '—'} ·{' '}
          {video.createdAt ? format(new Date(video.createdAt), 'MMM d, yyyy') : '—'}
        </p>
      </div>
    </div>
  );
}

function DetailsReadOnly({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<ArtistVideoListItem, string>;
}) {
  const video = rowDetails.data;
  const vf = (video as { videoFileUrl?: string }).videoFileUrl;
  const em = (video as { embedUrl?: string }).embedUrl;
  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={Video} label="Title" value={video.title} />
        <InfoCard icon={User} label="Artist" value={artistName(video.artist)} />
        <InfoCard icon={FileText} label="Views" value={String(video.views ?? 0)} />
        <InfoCard icon={FileText} label="Plays" value={String(video.plays ?? 0)} />
        <InfoCard icon={FileText} label="Downloads" value={String(video.downloads ?? 0)} />
        <InfoCard icon={FileText} label="Status" value={video.status ?? '—'} />
        <InfoCard icon={FileText} label="Category" value={video.category ?? '—'} />
        <InfoCard icon={FileText} label="Description" value={video.description ?? '—'} />
        <InfoCard icon={FileText} label="Thumbnail URL" value={video.thumbnail ?? '—'} />
        <InfoCard icon={FileText} label="Video file URL" value={vf ?? '—'} />
        <InfoCard icon={FileText} label="Embed URL" value={em ?? '—'} />
        <InfoCard icon={FileText} label="Legacy videoUrl" value={video.videoUrl ?? '—'} />
        <InfoCard
          icon={Calendar}
          label="Created"
          value={video.createdAt ? format(new Date(video.createdAt), 'MMM d, yyyy HH:mm:ss') : '—'}
        />
        <InfoCard
          icon={Calendar}
          label="Updated"
          value={video.updatedAt ? format(new Date(video.updatedAt), 'MMM d, yyyy HH:mm:ss') : '—'}
        />
        <InfoCard icon={Hash} label="ID" value={video._id} hasCopy copyValue={video._id} />
      </div>
    </div>
  );
}

interface VideosDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<ArtistVideoListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<ArtistVideoListItem, string> | undefined) => void;
  onSaved: () => void;
}

export function VideosDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
  onSaved,
}: VideosDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);
  const isEdit = clickedRowDetails?.index === -1;
  const rowId = clickedRowDetails?.data._id;

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<IArtistUpdateVideoPayload & { title: string }>({
    title: '',
  });
  const [assignOwnerUserId, setAssignOwnerUserId] = useState('');
  const [ownerMeta, setOwnerMeta] = useState<{
    ownerLocked: boolean;
    ownerUserId: string;
    hasArtist: boolean;
  }>({ ownerLocked: false, ownerUserId: '', hasArtist: false });

  const loadDetail = useCallback(async () => {
    if (!rowId) return;
    setLoadingDetail(true);
    try {
      const res = await callApi('ADMIN_VIDEO_ITEM', {
        query: `/${rowId}` as `/${string}`,
      });
      if (res.type !== 'success' || !res.data.video) return;
      const v = res.data.video;
      setForm({
        title: v.title ?? '',
        description: v.description ?? '',
        thumbnail: v.thumbnail ?? '',
        videoUrl: v.videoUrl ?? '',
        videoFileUrl: (v as { videoFileUrl?: string }).videoFileUrl ?? '',
        embedUrl: (v as { embedUrl?: string }).embedUrl ?? '',
        category: v.category ?? '',
        status: v.status,
        isMonetizable: v.isMonetizable,
      });
      const hasArtist = Boolean(v.artist);
      setOwnerMeta({
        ownerLocked: Boolean(v.ownerLocked ?? hasArtist),
        ownerUserId: v.ownerUserId ?? '',
        hasArtist,
      });
      setAssignOwnerUserId('');
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
    if (!rowId || !form.title?.trim()) return;
    setSaving(true);
    try {
      const payload: IAdminUpdateVideoPayload = {
        title: form.title.trim(),
        description: form.description?.trim() || undefined,
        thumbnail: form.thumbnail?.trim() || undefined,
        videoUrl: form.videoUrl?.trim() || undefined,
        videoFileUrl: form.videoFileUrl?.trim() || undefined,
        embedUrl: form.embedUrl?.trim() || undefined,
        category: form.category?.trim() || undefined,
        status: form.status,
        isMonetizable: form.isMonetizable,
      };
      const canAssignOwner = !ownerMeta.ownerLocked && !ownerMeta.hasArtist;
      if (canAssignOwner && assignOwnerUserId) {
        payload.ownerUserId = assignOwnerUserId;
      }

      const res = await callApi('ADMIN_VIDEO_UPDATE', {
        query: `/${rowId}` as `/${string}`,
        payload,
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
      title={isEdit ? 'Edit video' : 'Video details'}
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="video"
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
              disabled={saving || loadingDetail || !form.title?.trim()}
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
                value={form.status ?? 'draft'}
                onSelectChange={v =>
                  setForm(f => ({ ...f, status: v as NonNullable<typeof f.status> }))
                }
                options={statusOptions}
              />
              <RegularInput
                label="Category slug"
                value={form.category ?? ''}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                placeholder="e.g. movie, music, sermon"
              />
              <RegularTextarea
                label="Description"
                value={form.description ?? ''}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
              />
              <RegularInput
                label="Thumbnail URL"
                value={form.thumbnail ?? ''}
                onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))}
              />
              <RegularInput
                label="Video file URL (hosted file)"
                value={form.videoFileUrl ?? ''}
                onChange={e => setForm(f => ({ ...f, videoFileUrl: e.target.value }))}
              />
              <RegularInput
                label="Embed URL (YouTube / Vimeo page URL)"
                value={form.embedUrl ?? ''}
                onChange={e => setForm(f => ({ ...f, embedUrl: e.target.value }))}
              />
              <RegularInput
                label="Legacy videoUrl"
                value={form.videoUrl ?? ''}
                onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
              />
              {ownerMeta.ownerLocked || ownerMeta.hasArtist ? (
                <p className="text-sm text-muted-foreground rounded-md border border-border px-3 py-2 bg-muted/20">
                  Owner is set to artist profile{' '}
                  <strong>{artistName(clickedRowDetails.data.artist)}</strong>. It cannot be
                  changed.
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    No artist profile linked yet. Link a user once; the server attaches an artist
                    and locks ownership.
                  </p>
                  <AdminUserAccountPicker
                    value={assignOwnerUserId || ownerMeta.ownerUserId}
                    onChange={(id, _u) => setAssignOwnerUserId(id)}
                    initialLabel={
                      ownerMeta.ownerUserId && !assignOwnerUserId
                        ? `Pending user id: ${ownerMeta.ownerUserId}`
                        : null
                    }
                  />
                </>
              )}
            </>
          )}
        </div>
      ) : (
        <DetailsReadOnly rowDetails={clickedRowDetails} />
      )}
    </TableRowDetails>
  );
}
