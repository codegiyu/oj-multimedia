'use client';

import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { FileText, Hash } from 'lucide-react';
import type { ResourceListItem } from '@/lib/types/community';
import { InfoCard } from '@/components/general/InfoCard';

function DetailsHeader({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<ResourceListItem, string>;
}) {
  const resource = rowDetails.data;
  const status = (resource as ResourceListItem & { status?: string }).status;
  return (
    <div className="flex gap-3 items-center">
      <div className="grid gap-2 flex-1">
        <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
          {resource.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          {resource.type} · {status ?? '—'}
        </p>
      </div>
    </div>
  );
}

function DetailsContent({
  rowDetails,
}: {
  rowDetails: ClickedRowDetails<ResourceListItem, string>;
}) {
  const resource = rowDetails.data;
  const status = (resource as ResourceListItem & { status?: string }).status;

  return (
    <div className="grid gap-4 p-4">
      <div className="grid gap-3">
        <InfoCard icon={FileText} label="Title" value={resource.title} />
        <InfoCard icon={FileText} label="Type" value={resource.type} />
        <InfoCard icon={FileText} label="Status" value={status ?? '—'} />
        <InfoCard icon={FileText} label="Description" value={resource.description ?? '—'} />
        <InfoCard icon={FileText} label="Category" value={resource.category ?? '—'} />
        <InfoCard icon={FileText} label="Downloads" value={String(resource.downloads ?? 0)} />
        <InfoCard icon={Hash} label="ID" value={resource._id} hasCopy copyValue={resource._id} />
      </div>
    </div>
  );
}

interface ResourcesDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<ResourceListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<ResourceListItem, string> | undefined) => void;
}

export function ResourcesDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: ResourcesDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);

  if (!clickedRowDetails) return null;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="Resource details"
      data={clickedRowDetails.data as unknown as Record<string, unknown>}
      dataName="resource"
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
