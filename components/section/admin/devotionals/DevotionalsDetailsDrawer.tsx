'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { format } from 'date-fns';
import { FileText, User, Hash, Calendar } from 'lucide-react';
import type { DevotionalListItem, DevotionalDetail } from '@/lib/types/community';
import { InfoCard } from '@/components/general/InfoCard';
import { RegularInput } from '@/components/atoms/RegularInput';
import { RegularTextarea } from '@/components/atoms/RegularTextarea';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import type { SelectOption } from '@/lib/types/general';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { callApi } from '@/lib/services/callApi';
import { DEVOTIONAL_TYPES } from '@/lib/types/community';
import { AdminUserAccountPicker } from '@/components/section/admin/shared/AdminUserAccountPicker';

const statusOptions: SelectOption[] = [
  { text: 'Draft', value: 'draft' },
  { text: 'Published', value: 'published' },
  { text: 'Archived', value: 'archived' },
];

const typeOptions: SelectOption[] = DEVOTIONAL_TYPES.map(t => ({ text: t, value: t }));

function devotionalArtistLabel(d: DevotionalListItem | DevotionalDetail): string {
  const a = d.artist;
  if (!a) return '—';
  if (typeof a === 'string') return a;
  return a.name ?? '—';
}

function DetailsHeader({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<DevotionalListItem, string>;
}) {
  const devotional = rowDetails.data;
  const status = devotional.status;
  return (
    <div className="flex gap-3 items-center">
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          {devotional.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {devotional.author ?? '—'} · {status ?? '—'} ·{' '}
          {devotional.createdAt ? format(new Date(devotional.createdAt), 'MMM d, yyyy') : '—'}
        </p>
      </div>
    </div>
  );
}

function DetailsReadOnly({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<DevotionalListItem, string>;
}) {
  const devotional = rowDetails.data;
  const status = devotional.status;

  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={FileText} label="Title" value={devotional.title} />
        <InfoCard icon={User} label="Author" value={devotional.author ?? '—'} />
        <InfoCard icon={User} label="Linked artist" value={devotionalArtistLabel(devotional)} />
        <InfoCard icon={FileText} label="Views" value={String(devotional.views ?? 0)} />
        <InfoCard icon={FileText} label="Plays" value={String(devotional.plays ?? 0)} />
        <InfoCard icon={FileText} label="Status" value={status ?? '—'} />
        <InfoCard icon={FileText} label="Excerpt" value={devotional.excerpt ?? '—'} />
        <InfoCard icon={FileText} label="Category" value={devotional.category ?? '—'} />
        <InfoCard
          icon={FileText}
          label="Cover image"
          value={(devotional as { coverImage?: string }).coverImage ?? '—'}
        />
        <InfoCard
          icon={Calendar}
          label="Created"
          value={
            devotional.createdAt
              ? format(new Date(devotional.createdAt), 'MMM d, yyyy HH:mm:ss')
              : '—'
          }
        />
        <InfoCard
          icon={Hash}
          label="ID"
          value={devotional._id}
          hasCopy
          copyValue={devotional._id}
        />
      </div>
    </div>
  );
}

interface DevotionalsDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<DevotionalListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<DevotionalListItem, string> | undefined) => void;
  onSaved: () => void;
}

export function DevotionalsDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
  onSaved,
}: DevotionalsDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);
  const isEdit = clickedRowDetails?.index === -1;
  const rowId = clickedRowDetails?.data._id;

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: '',
    coverImage: '',
    type: 'daily' as (typeof DEVOTIONAL_TYPES)[number],
    status: 'draft' as 'draft' | 'published' | 'archived',
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
      const res = await callApi('ADMIN_DEVOTIONAL_ITEM', {
        query: `/${rowId}` as `/${string}`,
      });
      if (res.type !== 'success' || !res.data.devotional) return;
      const d = res.data.devotional as DevotionalDetail & {
        type?: string;
        status?: string;
        ownerLocked?: boolean;
        ownerUserId?: string;
      };
      setForm({
        title: d.title ?? '',
        excerpt: d.excerpt ?? '',
        content: d.content ?? '',
        category: d.category ?? '',
        author: d.author ?? '',
        coverImage: d.coverImage ?? '',
        type: (d.type as (typeof DEVOTIONAL_TYPES)[number]) ?? 'daily',
        status: (d.status as 'draft' | 'published' | 'archived') ?? 'draft',
      });
      const hasArtist = Boolean(d.artist);
      setOwnerMeta({
        ownerLocked: Boolean(d.ownerLocked ?? hasArtist),
        ownerUserId: d.ownerUserId ?? '',
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
      const canAssignOwner = !ownerMeta.ownerLocked && !ownerMeta.hasArtist;
      if (canAssignOwner && assignOwnerUserId) {
        payload.ownerUserId = assignOwnerUserId;
      }

      const res = await callApi('ADMIN_DEVOTIONAL_UPDATE', {
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
      title={isEdit ? 'Edit devotional' : 'Devotional details'}
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="devotional"
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
              <RegularTextarea
                label="Excerpt"
                value={form.excerpt}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                rows={2}
              />
              <RegularTextarea
                label="Content"
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={6}
              />
              {ownerMeta.ownerLocked || ownerMeta.hasArtist ? (
                <p className="text-sm text-muted-foreground rounded-md border border-border px-3 py-2 bg-muted/20">
                  Linked artist: <strong>{devotionalArtistLabel(clickedRowDetails.data)}</strong>.
                  Ownership cannot be changed.
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Optional: link a user account once so this devotional is attributed to their
                    artist profile.
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
