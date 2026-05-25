'use client';

import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { format } from 'date-fns';
import { Video, User, FileText, Calendar, Hash } from 'lucide-react';
import type { ArtistVideoListItem } from '@/lib/constants/endpoints';
import { InfoCard } from '@/components/general/InfoCard';
import { DashboardThumbnail } from '@/components/general/DashboardThumbnail';
import { DrawerMediaPreview } from '@/components/general/DrawerMediaPreview';
import { artistDisplayLabel } from '@/components/section/admin/shared/AdminEntityFieldLinks';
import {
  AdminArtistFieldLink,
  AdminContentCategoryFieldLink,
} from '@/components/section/admin/shared';

function DetailsHeader({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<ArtistVideoListItem, string>;
}) {
  const video = rowDetails.data;
  return (
    <div className="flex gap-3 items-start">
      <DashboardThumbnail src={video.thumbnail} alt={video.title} size={48} />
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          {video.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {artistDisplayLabel(video.artist)} · {video.status ?? '—'} ·{' '}
          {video.createdAt ? format(new Date(video.createdAt), 'MMM d, yyyy') : '—'}
        </p>
      </div>
    </div>
  );
}

function DetailsReadOnly({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<ArtistVideoListItem, string>;
}) {
  const video = rowDetails.data;
  const vf = (video as { videoFileUrl?: string }).videoFileUrl;
  const em = (video as { embedUrl?: string }).embedUrl;
  return (
    <div className="grid gap-4 p-4">
      <DrawerMediaPreview src={video.thumbnail} alt={video.title} />
      <div className="grid gap-3">
        <InfoCard icon={Video} label="Title" value={video.title} />
        <InfoCard icon={User} label="Artist">
          <AdminArtistFieldLink artist={video.artist} />
        </InfoCard>
        <InfoCard icon={FileText} label="Views" value={String(video.views ?? 0)} />
        <InfoCard icon={FileText} label="Plays" value={String(video.plays ?? 0)} />
        <InfoCard icon={FileText} label="Downloads" value={String(video.downloads ?? 0)} />
        <InfoCard icon={FileText} label="Status" value={video.status ?? '—'} />
        <InfoCard icon={FileText} label="Category">
          <AdminContentCategoryFieldLink category={video.category} />
        </InfoCard>
        <InfoCard
          icon={FileText}
          label="Description"
          value={video.description ?? '—'}
          preserveParagraphs
        />
        <InfoCard icon={FileText} label="Thumbnail URL" value={video.thumbnail ?? '—'} />
        <InfoCard icon={FileText} label="Video file URL" value={vf ?? '—'} />
        <InfoCard icon={FileText} label="Embed URL" value={em ?? '—'} />
        <InfoCard
          icon={FileText}
          label="Premium download"
          value={video.isMonetizable ? 'Yes' : 'No'}
        />
        <InfoCard
          icon={FileText}
          label="Price (NGN)"
          value={
            video.isMonetizable && typeof video.price === 'number' && video.price > 0
              ? String(video.price)
              : '—'
          }
        />
        <InfoCard
          icon={Calendar}
          label="Created"
          value={video.createdAt ? format(new Date(video.createdAt), 'MMM d, yyyy HH:mm:ss') : '—'}
        />
        <InfoCard
          icon={Calendar}
          label="Updated"
          value={video.updatedAt ? format(new Date(video.updatedAt), 'MMM d, yyyy HH:mm:ss') : '—'}
        />
        <InfoCard icon={Hash} label="ID" value={video._id} hasCopy copyValue={video._id} />
      </div>
    </div>
  );
}

interface VideosDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<ArtistVideoListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<ArtistVideoListItem, string> | undefined) => void;
}

export function VideosDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: VideosDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);

  if (!clickedRowDetails) return null;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="Video details"
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="video"
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
