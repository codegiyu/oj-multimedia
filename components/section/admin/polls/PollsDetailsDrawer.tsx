'use client';

import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { FileText, Hash } from 'lucide-react';
import type { PollListItem } from '@/lib/types/community';
import { InfoCard } from '@/components/general/InfoCard';

function DetailsHeader({ rowDetails }: { rowDetails: ClickedRowDetails<PollListItem, string> }) {
  const poll = rowDetails.data;
  return (
    <div className="flex gap-3 items-center">
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          {poll.question}
        </h2>
        <p className="text-sm text-muted-foreground">
          {poll.status} · {poll.totalVotes} votes · {poll.timeAgo}
        </p>
      </div>
    </div>
  );
}

function DetailsContent({ rowDetails }: { rowDetails: ClickedRowDetails<PollListItem, string> }) {
  const poll = rowDetails.data;

  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={FileText} label="Question" value={poll.question} />
        <InfoCard
          icon={FileText}
          label="Description"
          value={poll.description ?? '—'}
          preserveParagraphs
        />
        <InfoCard icon={FileText} label="Status" value={poll.status} />
        <InfoCard icon={FileText} label="Total Votes" value={String(poll.totalVotes)} />
        <InfoCard
          icon={FileText}
          label="Options"
          value={poll.options?.map(o => `${o.text} (${o.votes})`).join(', ') ?? '—'}
        />
        <InfoCard icon={Hash} label="ID" value={poll._id} hasCopy copyValue={poll._id} />
      </div>
    </div>
  );
}

interface PollsDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<PollListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<PollListItem, string> | undefined) => void;
}

export function PollsDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: PollsDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);

  if (!clickedRowDetails) return null;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="Poll details"
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="poll"
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
