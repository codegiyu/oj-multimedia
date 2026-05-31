'use client';

import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { FileText, User, Hash, Lock } from 'lucide-react';
import type { QuestionListItem } from '@/lib/types/community';
import { InfoCard } from '@/components/general/InfoCard';
import { MultilineText } from '@/components/general/MultilineText';
import { DashboardThumbnail } from '@/components/general/DashboardThumbnail';
import { DrawerMediaPreview } from '@/components/general/DrawerMediaPreview';
import { Badge } from '@/components/ui/badge';
import {
  AdminContentCategoryFieldLink,
  AdminPastorFieldLink,
} from '@/components/section/admin/shared/AdminEntityFieldLinks';

type ExtendedQuestion = QuestionListItem & {
  isPrivate?: boolean;
  requestedPastor?: QuestionListItem['requestedPastor'];
  answersList?: Array<{
    _id: string;
    answer: string;
    pastor?: { name?: string };
    likes?: number;
  }>;
  answers?: Array<{
    _id: string;
    answer: string;
    pastor?: { name?: string };
    likes?: number;
  }>;
};

function pastorImage(q: QuestionListItem): string | undefined {
  if (typeof q.pastor === 'object' && q.pastor && 'image' in q.pastor) {
    return q.pastor.image;
  }

  return undefined;
}

function DetailsHeader({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<QuestionListItem, string>;
}) {
  const q = rowDetails.data as ExtendedQuestion;
  const status = q.status;

  return (
    <div className="flex gap-3 items-start">
      <DashboardThumbnail src={pastorImage(q)} alt={q.author} size={48} rounded="full" />
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          {truncateQuestion(q.question)}
        </h2>
        <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
          <span>
            {q.author} · {status ?? '—'} · {q.timeAgo}
          </span>
          {q.isPrivate ? (
            <Badge variant="outline" className="gap-1">
              <Lock className="h-3 w-3" />
              Private
            </Badge>
          ) : null}
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
  const q = rowDetails.data as ExtendedQuestion;
  const status = q.status;
  const pastorName =
    typeof q.pastor === 'object' && q.pastor && 'name' in q.pastor
      ? String((q.pastor as { name?: string }).name ?? '')
      : typeof q.pastor === 'string'
        ? q.pastor
        : '';
  const answerEntries = q.answersList ?? q.answers ?? [];
  const requestedPastor = q.requestedPastor;

  return (
    <div className="grid gap-4 p-4">
      <DrawerMediaPreview src={pastorImage(q)} alt={pastorName || q.author} size="sm" />
      <div className="grid gap-3">
        {q.isPrivate ? (
          <InfoCard
            icon={Lock}
            label="Private question"
            value="Question text is hidden on public surfaces. Metadata shown below."
          />
        ) : null}
        <InfoCard icon={FileText} label="Question" value={q.question} preserveParagraphs />
        <InfoCard icon={User} label="Author" value={q.author} />
        <InfoCard icon={FileText} label="Status" value={status ?? '—'} />
        <InfoCard icon={FileText} label="Category">
          <AdminContentCategoryFieldLink category={q.category} />
        </InfoCard>
        {requestedPastor ? (
          <InfoCard icon={User} label="Requested pastor">
            <AdminPastorFieldLink pastor={requestedPastor} />
          </InfoCard>
        ) : null}
        {pastorName && pastorName !== '—' ? (
          <InfoCard icon={User} label="Assigned pastor">
            <AdminPastorFieldLink pastor={q.pastor} />
          </InfoCard>
        ) : null}
        {answerEntries.length > 0 ? (
          <div className="grid gap-3">
            <p className="text-xs font-medium text-muted-foreground">
              Answers ({answerEntries.length})
            </p>
            {answerEntries.map(entry => (
              <div key={entry._id} className="rounded-md border border-border p-3 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  {entry.pastor?.name ?? 'Pastor'}
                  {entry.likes != null ? ` · ${entry.likes} likes` : ''}
                </p>
                <MultilineText text={entry.answer} className="text-sm text-foreground" />
              </div>
            ))}
          </div>
        ) : q.answer ? (
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
