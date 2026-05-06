'use client';

import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { format } from 'date-fns';
import { BookOpen, Calendar, Hash, ToggleLeft } from 'lucide-react';
import type { IGospelVerse } from '@/lib/types/server-models';
import { InfoCard } from '@/components/general/InfoCard';
import { Badge } from '@/components/ui/badge';

function DetailsHeader({ rowDetails }: { rowDetails: ClickedRowDetails<IGospelVerse, string> }) {
  const verse = rowDetails.data;
  return (
    <div className="flex gap-3 items-center">
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          {verse.reference}
        </h2>
        <p className="text-sm text-muted-foreground">
          {verse.date ? format(new Date(verse.date), 'MMM d, yyyy') : 'No date set'}
        </p>
      </div>
      <Badge variant={verse.isActive ? 'default' : 'secondary'}>
        {verse.isActive ? 'Active' : 'Inactive'}
      </Badge>
    </div>
  );
}

function DetailsContent({ rowDetails }: { rowDetails: ClickedRowDetails<IGospelVerse, string> }) {
  const verse = rowDetails.data;

  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={BookOpen} label="Verse text" value={verse.verse} preserveParagraphs />
        <InfoCard
          icon={Calendar}
          label="Verse date"
          value={verse.date ? format(new Date(verse.date), 'MMM d, yyyy') : '—'}
        />
        <InfoCard
          icon={ToggleLeft}
          label="Status"
          value={verse.isActive ? 'Shown on site' : 'Hidden'}
        />
        <InfoCard
          icon={Calendar}
          label="Created"
          value={verse.createdAt ? format(new Date(verse.createdAt), 'MMM d, yyyy HH:mm:ss') : '—'}
        />
        <InfoCard
          icon={Calendar}
          label="Updated"
          value={verse.updatedAt ? format(new Date(verse.updatedAt), 'MMM d, yyyy HH:mm:ss') : '—'}
        />
        <InfoCard icon={Hash} label="ID" value={verse._id} hasCopy copyValue={verse._id} />
      </div>
    </div>
  );
}

interface GospelVerseDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<IGospelVerse, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<IGospelVerse, string> | undefined) => void;
}

export function GospelVerseDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: GospelVerseDetailsDrawerProps) {
  const closeDrawer = () => {
    setClickedRowDetails(undefined);
  };

  if (!clickedRowDetails) return null;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="Gospel verse details"
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="gospel verse"
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
