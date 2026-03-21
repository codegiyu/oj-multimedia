'use client';

import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { format } from 'date-fns';
import { Newspaper, FileText, Calendar, Hash } from 'lucide-react';
import type { PublicNewsListItem } from '@/lib/constants/endpoints';
import { InfoCard } from '@/components/general/InfoCard';

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

function DetailsContent({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<PublicNewsListItem, string>;
}) {
  const newsItem = rowDetails.data;

  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={Newspaper} label="Title" value={newsItem.title} />
        <InfoCard icon={FileText} label="Status" value={newsItem.status ?? '—'} />
        <InfoCard icon={FileText} label="Excerpt" value={newsItem.excerpt ?? '—'} />
        <InfoCard
          icon={FileText}
          label="Content"
          value={newsItem.content ?? '—'}
          className="[&_.line-clamp-1]:line-clamp-none"
        />
        <InfoCard
          icon={Calendar}
          label="Created"
          value={
            newsItem.createdAt ? format(new Date(newsItem.createdAt), 'MMM d, yyyy HH:mm:ss') : '—'
          }
        />
        <InfoCard
          icon={Calendar}
          label="Updated"
          value={
            newsItem.updatedAt ? format(new Date(newsItem.updatedAt), 'MMM d, yyyy HH:mm:ss') : '—'
          }
        />
        <InfoCard icon={Hash} label="ID" value={newsItem._id} hasCopy copyValue={newsItem._id} />
      </div>
    </div>
  );
}

interface NewsDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<PublicNewsListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<PublicNewsListItem, string> | undefined) => void;
}

export function NewsDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: NewsDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);

  if (!clickedRowDetails) return null;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="News article details"
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="news article"
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
