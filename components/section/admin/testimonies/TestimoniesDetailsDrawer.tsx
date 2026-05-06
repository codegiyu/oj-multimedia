'use client';

import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { FileText, User, Hash } from 'lucide-react';
import type { TestimonyListItem } from '@/lib/types/community';
import { InfoCard } from '@/components/general/InfoCard';

function DetailsHeader({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<TestimonyListItem, string>;
}) {
  const testimony = rowDetails.data;
  const status = (testimony as { status?: string }).status;
  return (
    <div className="flex gap-3 items-center">
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          Testimony by {testimony.author}
        </h2>
        <p className="text-sm text-muted-foreground">
          {status ?? '—'} · {testimony.timeAgo}
        </p>
      </div>
    </div>
  );
}

function DetailsContent({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<TestimonyListItem, string>;
}) {
  const testimony = rowDetails.data;
  const status = (testimony as { status?: string }).status;

  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={User} label="Author" value={testimony.author} />
        <InfoCard icon={FileText} label="Status" value={status ?? '—'} />
        <InfoCard icon={FileText} label="Category" value={testimony.category ?? '—'} />
        <InfoCard
          icon={FileText}
          label="Content"
          value={testimony.content}
          preserveParagraphs
          className="[&_.line-clamp-1]:line-clamp-none"
        />
        <InfoCard icon={Hash} label="ID" value={testimony._id} hasCopy copyValue={testimony._id} />
      </div>
    </div>
  );
}

interface TestimoniesDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<TestimonyListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<TestimonyListItem, string> | undefined) => void;
}

export function TestimoniesDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: TestimoniesDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);

  if (!clickedRowDetails) return null;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="Testimony details"
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="testimony"
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
