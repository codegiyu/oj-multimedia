'use client';

import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { format } from 'date-fns';
import { Newspaper, FileText, Calendar, Hash } from 'lucide-react';
import type { PublicNewsListItem } from '@/lib/constants/endpoints';
import { InfoCard } from '@/components/general/InfoCard';
import { DashboardThumbnail } from '@/components/general/DashboardThumbnail';
import { DrawerMediaPreview } from '@/components/general/DrawerMediaPreview';

function DetailsHeader({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<PublicNewsListItem, string>;
}) {
  const newsItem = rowDetails.data;
  return (
    <div className="flex gap-3 items-start">
      <DashboardThumbnail src={newsItem.coverImage} alt={newsItem.title} size={48} />
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

function DetailsReadOnly({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<PublicNewsListItem, string>;
}) {
  const n = rowDetails.data;
  return (
    <div className="grid gap-4 p-4">
      <DrawerMediaPreview src={n.coverImage} alt={n.title} images={n.images} />
      <div className="grid gap-3">
        <InfoCard icon={Newspaper} label="Title" value={n.title} />
        <InfoCard icon={FileText} label="Author" value={n.author ?? '—'} />
        <InfoCard icon={FileText} label="Category" value={n.category ?? '—'} />
        <InfoCard icon={FileText} label="Status" value={n.status ?? '—'} />
        <InfoCard icon={FileText} label="Excerpt" value={n.excerpt ?? '—'} preserveParagraphs />
        <InfoCard
          icon={FileText}
          label="Content"
          value={n.content ?? '—'}
          preserveParagraphs
          className="[&_.line-clamp-1]:line-clamp-none"
        />
        <InfoCard icon={FileText} label="Cover URL" value={n.coverImage ?? '—'} />
        <InfoCard icon={FileText} label="Audio URL" value={n.audioUrl ?? '—'} />
        <InfoCard icon={FileText} label="Video file URL" value={n.videoFileUrl ?? '—'} />
        <InfoCard icon={FileText} label="Embed URL" value={n.embedUrl ?? '—'} />
        <InfoCard icon={FileText} label="Download URL" value={n.downloadUrl ?? '—'} />
        <InfoCard
          icon={Calendar}
          label="Created"
          value={n.createdAt ? format(new Date(n.createdAt), 'MMM d, yyyy HH:mm:ss') : '—'}
        />
        <InfoCard
          icon={Calendar}
          label="Updated"
          value={n.updatedAt ? format(new Date(n.updatedAt), 'MMM d, yyyy HH:mm:ss') : '—'}
        />
        <InfoCard icon={Hash} label="ID" value={n._id} hasCopy copyValue={n._id} />
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
      <DetailsReadOnly rowDetails={clickedRowDetails} />
    </TableRowDetails>
  );
}
