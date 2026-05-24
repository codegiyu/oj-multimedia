'use client';

import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { User, FileText, Hash } from 'lucide-react';
import type { PastorListItem } from '@/lib/types/community';
import { InfoCard } from '@/components/general/InfoCard';
import { DashboardThumbnail } from '@/components/general/DashboardThumbnail';
import { DrawerMediaPreview } from '@/components/general/DrawerMediaPreview';
import { Badge } from '@/components/ui/badge';

interface PastorsDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<PastorListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<PastorListItem, string> | undefined) => void;
}

export function PastorsDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: PastorsDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);
  const data = clickedRowDetails?.data;

  if (!clickedRowDetails || !data) return null;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="Pastor details"
      data={data as unknown as Record<string, unknown>}
      dataName="pastor"
      showMeta={false}
      setShowMeta={() => {}}
      header={
        <div className="flex gap-3 items-start">
          <DashboardThumbnail src={data.image} alt={data.name} size={48} rounded="full" />
          <div className="grid gap-2 flex-1">
            <h2 className="text-[1.125rem] leading-none font-semibold -tracking-[0.36px] text-foreground/90">
              {data.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant={data.isActive === false ? 'secondary' : 'default'}>
                {data.isActive === false ? 'Inactive' : 'Active'}
              </Badge>
              {data.isFeatured ? <Badge variant="outline">Featured</Badge> : null}
            </div>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-foreground/7" />
      }>
      <div className="grid gap-4 p-4">
        <DrawerMediaPreview src={data.image} alt={data.name} size="sm" />
        <div className="grid gap-3">
          <InfoCard icon={User} label="Name" value={data.name} />
          <InfoCard
            icon={FileText}
            label="Image URL"
            value={data.image ?? '—'}
            className="[&_.line-clamp-1]:line-clamp-none"
          />
          <InfoCard icon={FileText} label="Title" value={data.title ?? '—'} />
          <InfoCard icon={FileText} label="Church" value={data.church ?? '—'} />
          <InfoCard icon={Hash} label="ID" value={data._id} hasCopy copyValue={data._id} />
        </div>
      </div>
    </TableRowDetails>
  );
}
