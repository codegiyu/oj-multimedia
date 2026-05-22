'use client';

import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { FileText, User, Hash } from 'lucide-react';
import type { QuestionListItem } from '@/lib/types/community';
import { InfoCard } from '@/components/general/InfoCard';
import { MultilineText } from '@/components/general/MultilineText';

function DetailsHeader({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<QuestionListItem, string>;
}) {
  const q = rowDetails.data;
  const status = (q as QuestionListItem & { status?: string }).status;

  return (
    <div className="flex gap-3 items-center">
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          {truncateQuestion(q.question)}
        </h2>
        <p className="text-sm text-muted-foreground">
          {q.author} · {status ?? '—'} · {q.timeAgo}
        </p>
      </div>
    </div>
  );
}

function truncateQuestion(text: string) {
  if (text.length <= 80) return text;
  return text.slice(0, 80).trim() + '…';
}

function DetailsContent({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<QuestionListItem, string>;
}) {
  const q = rowDetails.data;
  const status = (q as QuestionListItem & { status?: string }).status;
  const pastorName =
    typeof q.pastor === 'object' && q.pastor && 'name' in q.pastor
      ? String((q.pastor as { name?: string }).name ?? '')
      : typeof q.pastor === 'string'
        ? q.pastor
        : '';

  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={FileText} label="Question" value={q.question} preserveParagraphs />
        <InfoCard icon={User} label="Author" value={q.author} />
        <InfoCard icon={FileText} label="Status" value={status ?? '—'} />
        <InfoCard icon={FileText} label="Category" value={q.category ?? '—'} />
        {pastorName ? <InfoCard icon={User} label="Assigned pastor" value={pastorName} /> : null}
        {q.answer ? (
          <div className="grid gap-1">
            <p className="text-xs font-medium text-muted-foreground">Answer</p>
            <MultilineText text={q.answer} className="text-sm text-foreground" />
          </div>
        ) : null}
        <InfoCard icon={Hash} label="ID" value={q._id} hasCopy copyValue={q._id} />
      </div>
    </div>
  );
}

interface AskAPastorDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<QuestionListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<QuestionListItem, string> | undefined) => void;
}

export function AskAPastorDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: AskAPastorDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);

  if (!clickedRowDetails) return null;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="Question details"
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="question"
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
