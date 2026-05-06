'use client';

import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { FileText, User, Hash } from 'lucide-react';
import type { PrayerRequestListItem } from '@/lib/types/community';
import { InfoCard } from '@/components/general/InfoCard';

function DetailsHeader({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<PrayerRequestListItem, string>;
}) {
  const pr = rowDetails.data;
  const status = (pr as PrayerRequestListItem & { status?: string }).status;
  return (
    <div className="flex gap-3 items-center">
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          {pr.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {pr.author} · {status ?? '—'} · {pr.timeAgo}
        </p>
      </div>
    </div>
  );
}

function DetailsContent({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<PrayerRequestListItem, string>;
}) {
  const pr = rowDetails.data;
  const status = (pr as PrayerRequestListItem & { status?: string }).status;

  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={FileText} label="Title" value={pr.title} />
        <InfoCard icon={User} label="Author" value={pr.author} />
        <InfoCard icon={FileText} label="Status" value={status ?? '—'} />
        <InfoCard icon={FileText} label="Category" value={pr.category ?? '—'} />
        <InfoCard
          icon={FileText}
          label="Content"
          value={pr.content}
          preserveParagraphs
          className="[&_.line-clamp-1]:line-clamp-none"
        />
        <InfoCard icon={Hash} label="ID" value={pr._id} hasCopy copyValue={pr._id} />
      </div>
    </div>
  );
}

interface PrayerRequestsDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<PrayerRequestListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<PrayerRequestListItem, string> | undefined) => void;
}

export function PrayerRequestsDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: PrayerRequestsDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);

  if (!clickedRowDetails) return null;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="Prayer request details"
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="prayerRequest"
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
