'use client';

import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { User, FileText, Hash } from 'lucide-react';
import type { ArtistListItem } from '@/lib/types/community';
import type { PastorListItem } from '@/lib/types/community';
import { InfoCard } from '@/components/general/InfoCard';

function ArtistDetails({ data }: { data: ArtistListItem }) {
  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={User} label="Name" value={data.name} />
        <InfoCard icon={FileText} label="Slug" value={data.slug} />
        <InfoCard icon={FileText} label="Genre" value={data.genre ?? '—'} />
        <InfoCard icon={Hash} label="ID" value={data._id} hasCopy copyValue={data._id} />
      </div>
    </div>
  );
}

function PastorDetails({ data }: { data: PastorListItem }) {
  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={User} label="Name" value={data.name} />
        <InfoCard icon={FileText} label="Title" value={data.title ?? '—'} />
        <InfoCard icon={FileText} label="Church" value={data.church ?? '—'} />
        <InfoCard icon={Hash} label="ID" value={data._id} hasCopy copyValue={data._id} />
      </div>
    </div>
  );
}

interface ArtistsPastorsDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<ArtistListItem | PastorListItem, string> | undefined;
  setClickedRowDetails: (
    d: ClickedRowDetails<ArtistListItem | PastorListItem, string> | undefined
  ) => void;
}

export function ArtistsPastorsDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: ArtistsPastorsDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);

  if (!clickedRowDetails) return null;

  const data = clickedRowDetails.data;
  const isArtist = 'genre' in data;
  const title = isArtist ? (data as ArtistListItem).name : (data as PastorListItem).name;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title={isArtist ? 'Artist details' : 'Pastor details'}
      data={data as unknown as Record<string, unknown>}
      dataName={isArtist ? 'artist' : 'pastor'}
      showMeta={false}
      setShowMeta={() => {}}
      header={
        <div className="flex gap-3 items-center">
          <div className="grid gap-2 flex-1">
            <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
              {title}
            </h2>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-foreground/7" />
      }>
      {isArtist ? (
        <ArtistDetails data={data as ArtistListItem} />
      ) : (
        <PastorDetails data={data as PastorListItem} />
      )}
    </TableRowDetails>
  );
}
