'use client';

import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { format } from 'date-fns';
import { Music, User, FileText, Calendar, Hash, DiscAlbum } from 'lucide-react';
import type { ArtistMusicListItem } from '@/lib/constants/endpoints';
import { InfoCard } from '@/components/general/InfoCard';
import { DashboardThumbnail } from '@/components/general/DashboardThumbnail';
import { DrawerMediaPreview } from '@/components/general/DrawerMediaPreview';
import { artistDisplayLabel } from '@/components/section/admin/shared/AdminEntityFieldLinks';
import {
  AdminArtistFieldLink,
  AdminContentCategoryFieldLink,
  AdminMusicAlbumFieldLink,
} from '@/components/section/admin/shared';

function DetailsHeader({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<ArtistMusicListItem, string>;
}) {
  const music = rowDetails.data;
  return (
    <div className="flex gap-3 items-start">
      <DashboardThumbnail src={music.coverImage} alt={music.title} size={48} />
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          {music.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {artistDisplayLabel(music.artist)} · {music.status ?? '—'} ·{' '}
          {music.createdAt ? format(new Date(music.createdAt), 'MMM d, yyyy') : '—'}
        </p>
      </div>
    </div>
  );
}

function DetailsReadOnly({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<ArtistMusicListItem, string>;
}) {
  const music = rowDetails.data;
  return (
    <div className="grid gap-4 p-4">
      <DrawerMediaPreview src={music.coverImage} alt={music.title} />
      <div className="grid gap-3">
        <InfoCard icon={Music} label="Title" value={music.title} />
        <InfoCard icon={User} label="Artist">
          <AdminArtistFieldLink artist={music.artist} />
        </InfoCard>
        <InfoCard icon={DiscAlbum} label="Album">
          <AdminMusicAlbumFieldLink music={music} />
        </InfoCard>
        <InfoCard icon={FileText} label="Status" value={music.status ?? '—'} />
        <InfoCard icon={FileText} label="Category">
          <AdminContentCategoryFieldLink category={music.category} />
        </InfoCard>
        <InfoCard icon={FileText} label="Views" value={String(music.views ?? 0)} />
        <InfoCard icon={FileText} label="Plays" value={String(music.plays ?? 0)} />
        <InfoCard
          icon={FileText}
          label="Downloads"
          value={String((music as { downloads?: number }).downloads ?? 0)}
        />
        <InfoCard
          icon={FileText}
          label="Excerpt"
          value={(music as { excerpt?: string }).excerpt ?? '—'}
        />
        <InfoCard
          icon={FileText}
          label="Description"
          value={music.description ?? '—'}
          preserveParagraphs
        />
        {music.lyrics && (
          <InfoCard
            icon={FileText}
            label="Lyrics"
            value={music.lyrics}
            preserveParagraphs
            className="[&_.line-clamp-1]:line-clamp-none"
          />
        )}
        <InfoCard
          icon={FileText}
          label="Cover URL"
          value={music.coverImage ?? '—'}
          className="[&_.line-clamp-1]:line-clamp-none"
        />
        <InfoCard
          icon={FileText}
          label="Audio URL"
          value={music.audioUrl ?? '—'}
          className="[&_.line-clamp-1]:line-clamp-none"
        />
        <InfoCard
          icon={FileText}
          label="Download URL"
          value={(music as { downloadUrl?: string }).downloadUrl ?? '—'}
          className="[&_.line-clamp-1]:line-clamp-none"
        />
        <InfoCard
          icon={FileText}
          label="Premium download"
          value={music.isMonetizable ? 'Yes' : 'No'}
        />
        <InfoCard
          icon={FileText}
          label="Price (NGN)"
          value={
            music.isMonetizable && typeof music.price === 'number' && music.price > 0
              ? String(music.price)
              : '—'
          }
        />
        <InfoCard
          icon={Calendar}
          label="Created"
          value={music.createdAt ? format(new Date(music.createdAt), 'MMM d, yyyy HH:mm:ss') : '—'}
        />
        <InfoCard
          icon={Calendar}
          label="Updated"
          value={music.updatedAt ? format(new Date(music.updatedAt), 'MMM d, yyyy HH:mm:ss') : '—'}
        />
        <InfoCard icon={Hash} label="ID" value={music._id} hasCopy copyValue={music._id} />
      </div>
    </div>
  );
}

interface MusicDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<ArtistMusicListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<ArtistMusicListItem, string> | undefined) => void;
}

export function MusicDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: MusicDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);

  if (!clickedRowDetails) return null;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="Music details"
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="music"
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
