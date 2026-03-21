'use client';

import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { format } from 'date-fns';
import { FileText, User, Hash, Calendar } from 'lucide-react';
import type { DevotionalListItem } from '@/lib/types/community';
import { InfoCard } from '@/components/general/InfoCard';

function DetailsHeader({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<DevotionalListItem, string>;
}) {
  const devotional = rowDetails.data;
  const status = (devotional as { status?: string }).status;
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

function DetailsContent({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<DevotionalListItem, string>;
}) {
  const devotional = rowDetails.data;
  const status = (devotional as { status?: string }).status;

  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={FileText} label="Title" value={devotional.title} />
        <InfoCard icon={User} label="Author" value={devotional.author ?? '—'} />
        <InfoCard icon={FileText} label="Status" value={status ?? '—'} />
        <InfoCard icon={FileText} label="Excerpt" value={devotional.excerpt ?? '—'} />
        <InfoCard icon={FileText} label="Category" value={devotional.category ?? '—'} />
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
}

export function DevotionalsDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: DevotionalsDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);

  if (!clickedRowDetails) return null;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="Devotional details"
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="devotional"
      showMeta={false}
      setShowMeta={() => {}}
      header={<DetailsHeader rowDetails={clickedRowDetails} />}
      footer={
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-foreground/7" />
      }>
      <DetailsContent rowDetails={clickedRowDetails} />
    </TableRowDetails>
  );
}
