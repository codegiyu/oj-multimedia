'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { format } from 'date-fns';
import { Music, User, FileText, Calendar, Hash } from 'lucide-react';
import type {
  ArtistMusicListItem,
  IArtistUpdateMusicPayload,
  IAdminUpdateMusicPayload,
} from '@/lib/constants/endpoints';
import { InfoCard } from '@/components/general/InfoCard';
import { AdminUserAccountPicker } from '@/components/section/admin/shared/AdminUserAccountPicker';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import type { SelectOption } from '@/lib/types/general';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';

function artistName(artist: ArtistMusicListItem['artist']): string {
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
  rowDetails: ClickedRowDetails<ArtistMusicListItem, string>;
}) {
  const music = rowDetails.data;
  return (
    <div className="flex gap-3 items-center">
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          {music.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {artistName(music.artist)} · {music.status ?? '—'} ·{' '}
          {music.createdAt ? format(new Date(music.createdAt), 'MMM d, yyyy') : '—'}
        </p>
      </div>
    </div>
  );
}

function DetailsReadOnly({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<ArtistMusicListItem, string>;
}) {
  const music = rowDetails.data;
  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={Music} label="Title" value={music.title} />
        <InfoCard icon={User} label="Artist" value={artistName(music.artist)} />
        <InfoCard icon={FileText} label="Status" value={music.status ?? '—'} />
        <InfoCard icon={FileText} label="Category" value={music.category ?? '—'} />
        <InfoCard icon={FileText} label="Views" value={String(music.views ?? 0)} />
        <InfoCard icon={FileText} label="Plays" value={String(music.plays ?? 0)} />
        <InfoCard
          icon={FileText}
          label="Downloads"
          value={String((music as { downloads?: number }).downloads ?? 0)}
        />
        <InfoCard
          icon={FileText}
          label="Excerpt"
          value={(music as { excerpt?: string }).excerpt ?? '—'}
        />
        <InfoCard icon={FileText} label="Description" value={music.description ?? '—'} />
        {music.lyrics && (
          <InfoCard
            icon={FileText}
            label="Lyrics"
            value={music.lyrics}
            className="[&_.line-clamp-1]:line-clamp-none"
          />
        )}
        <InfoCard
          icon={FileText}
          label="Cover URL"
          value={music.coverImage ?? '—'}
          className="[&_.line-clamp-1]:line-clamp-none"
        />
        <InfoCard
          icon={FileText}
          label="Audio URL"
          value={music.audioUrl ?? '—'}
          className="[&_.line-clamp-1]:line-clamp-none"
        />
        <InfoCard
          icon={FileText}
          label="Download URL"
          value={(music as { downloadUrl?: string }).downloadUrl ?? '—'}
          className="[&_.line-clamp-1]:line-clamp-none"
        />
        <InfoCard
          icon={Calendar}
          label="Created"
          value={music.createdAt ? format(new Date(music.createdAt), 'MMM d, yyyy HH:mm:ss') : '—'}
        />
        <InfoCard
          icon={Calendar}
          label="Updated"
          value={music.updatedAt ? format(new Date(music.updatedAt), 'MMM d, yyyy HH:mm:ss') : '—'}
        />
        <InfoCard icon={Hash} label="ID" value={music._id} hasCopy copyValue={music._id} />
      </div>
    </div>
  );
}

interface MusicDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<ArtistMusicListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<ArtistMusicListItem, string> | undefined) => void;
  onSaved: () => void;
}

export function MusicDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
  onSaved,
}: MusicDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);
  const isEdit = clickedRowDetails?.index === -1;
  const rowId = clickedRowDetails?.data._id;

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<IArtistUpdateMusicPayload & { title: string }>({
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
      const res = await callApi('ADMIN_MUSIC_ITEM', {
        query: `/${rowId}` as `/${string}`,
      });
      if (res.type !== 'success' || !res.data.music) return;
      const m = res.data.music;
      setForm({
        title: m.title ?? '',
        description: m.description ?? '',
        lyrics: m.lyrics ?? '',
        excerpt: m.excerpt ?? '',
        category: m.category ?? '',
        coverImage: m.coverImage ?? '',
        audioUrl: m.audioUrl ?? '',
        videoUrl: m.videoUrl ?? '',
        downloadUrl: m.downloadUrl ?? '',
        status: m.status,
        isMonetizable: m.isMonetizable,
      });
      const hasArtist = Boolean(m.artist);
      setOwnerMeta({
        ownerLocked: Boolean(m.ownerLocked ?? hasArtist),
        ownerUserId: m.ownerUserId ?? '',
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
      const payload: IAdminUpdateMusicPayload = {
        title: form.title.trim(),
        description: form.description?.trim() || undefined,
        lyrics: form.lyrics?.trim() || undefined,
        excerpt: form.excerpt?.trim() || undefined,
        category: form.category?.trim() || undefined,
        coverImage: form.coverImage?.trim() || undefined,
        audioUrl: form.audioUrl?.trim() || undefined,
        videoUrl: form.videoUrl?.trim() || undefined,
        downloadUrl: form.downloadUrl?.trim() || undefined,
        status: form.status,
        isMonetizable: form.isMonetizable,
      };
      const canAssignOwner = !ownerMeta.ownerLocked && !ownerMeta.hasArtist;
      if (canAssignOwner && assignOwnerUserId) {
        payload.ownerUserId = assignOwnerUserId;
      }

      const res = await callApi('ADMIN_MUSIC_UPDATE', {
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
      title={isEdit ? 'Edit music' : 'Music details'}
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="music"
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
                placeholder="e.g. gospel, sermon"
              />
              <RegularInput
                label="Excerpt"
                value={form.excerpt ?? ''}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              />
              <RegularTextarea
                label="Description"
                value={form.description ?? ''}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
              />
              <RegularTextarea
                label="Lyrics"
                value={form.lyrics ?? ''}
                onChange={e => setForm(f => ({ ...f, lyrics: e.target.value }))}
                rows={4}
              />
              <RegularInput
                label="Cover image URL"
                value={form.coverImage ?? ''}
                onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
              />
              <RegularInput
                label="Audio URL"
                value={form.audioUrl ?? ''}
                onChange={e => setForm(f => ({ ...f, audioUrl: e.target.value }))}
              />
              <RegularInput
                label="Video URL (legacy)"
                value={form.videoUrl ?? ''}
                onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
              />
              <RegularInput
                label="Download URL"
                value={form.downloadUrl ?? ''}
                onChange={e => setForm(f => ({ ...f, downloadUrl: e.target.value }))}
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
