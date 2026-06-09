'use client';

import { useEffect, useState, startTransition } from 'react';
import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { Mail, Phone, User as UserIcon, Mic2, Store, Church } from 'lucide-react';
import type { UserDetail, UserListItem } from '@/lib/types/adminUsers';
import { InfoCard } from '@/components/general/InfoCard';
import { DashboardThumbnail } from '@/components/general/DashboardThumbnail';
import { Badge } from '@/components/ui/badge';
import {
  AdminUserLinkedArtistFieldLink,
  AdminUserLinkedVendorFieldLink,
  AdminUserLinkedPastorFieldLink,
} from '@/components/section/admin/shared';
import { callApi } from '@/lib/services/callApi';
import { formatUserDisplayName } from '@/lib/utils/formatUserDisplayName';
import { cn } from '@/lib/utils';

function statusBadgeVariant(status: string): 'default' | 'destructive' | 'secondary' {
  if (status === 'active') return 'default';
  if (status === 'suspended' || status === 'blacklisted') return 'destructive';

  return 'secondary';
}

interface UsersDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<UserListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<UserListItem, string> | undefined) => void;
}

export function UsersDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
}: UsersDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);
  const listRow = clickedRowDetails?.data;
  const userId = listRow?._id ?? null;

  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clickedRowDetails || !userId) {
      startTransition(() => {
        setDetail(null);
        setError(null);
        setLoading(false);
      });
      return;
    }

    setLoading(true);
    setError(null);
    void callApi('ADMIN_USER_ITEM', { query: `/${userId}` as `/${string}` })
      .then(res => {
        if (res.type === 'success') {
          setDetail(res.data.user);
          return;
        }
        setDetail(null);
        setError(res.error?.message ?? 'Could not load user details.');
      })
      .finally(() => setLoading(false));
  }, [clickedRowDetails, userId]);

  if (!clickedRowDetails || !listRow) return null;

  const data = detail ?? listRow;
  const displayName = formatUserDisplayName(data);
  const artistId = detail?.linkedArtist?._id ?? data.artistId;
  const artistName = data.linkedArtistName || detail?.linkedArtist?.name;
  const vendorId = detail?.linkedVendor?._id ?? data.vendorId;
  const vendorName = data.linkedVendorName || detail?.linkedVendor?.storeName;
  const pastorId = detail?.linkedPastor?._id ?? data.pastorId;
  const pastorName = data.linkedPastorName || detail?.linkedPastor?.name;

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="User details"
      data={data as unknown as Record<string, unknown>}
      dataName="user"
      showMeta={false}
      setShowMeta={() => {}}
      headerClassName="text-center"
      header={
        <div className="flex flex-col items-center gap-3 w-full pt-2">
          <DashboardThumbnail
            src={data.avatar}
            alt={displayName}
            rounded="full"
            size={96}
            className="ring-2 ring-primary ring-offset-2 ring-offset-background"
          />
          <div className="min-w-0 space-y-1 w-full">
            <p className="font-semibold text-xl truncate">{displayName}</p>
            {data.title ? <p className="text-sm text-muted-foreground">{data.title}</p> : null}
            <p className="text-sm text-muted-foreground truncate">{data.email}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant={statusBadgeVariant(data.accountStatus)} className="capitalize">
              {data.accountStatus}
            </Badge>

            {artistId ? (
              <Badge variant="outline" className="gap-1 border-primary/40 text-primary">
                <Mic2 className="h-3 w-3" aria-hidden />
                {artistName?.trim() || 'Artist'}
              </Badge>
            ) : null}

            {vendorId ? (
              <Badge variant="outline" className="gap-1 border-primary/40 text-primary">
                <Store className="h-3 w-3" aria-hidden />
                {vendorName?.trim() || 'Vendor'}
              </Badge>
            ) : null}

            {pastorId ? (
              <Badge variant="outline" className="gap-1 border-primary/40 text-primary">
                <Church className="h-3 w-3" aria-hidden />
                {pastorName?.trim() || 'Pastor'}
              </Badge>
            ) : null}

            {detail?.roleSlugs?.map(slug => (
              <Badge key={slug} variant="secondary" className="uppercase text-xs">
                {slug}
              </Badge>
            ))}

            {data.deleteRequestedAt ? (
              <Badge variant="destructive">Deletion requested</Badge>
            ) : null}
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-foreground/7" />
      }>
      {loading ? <p className="text-sm text-muted-foreground p-4">Loading details…</p> : null}
      {error ? <p className="text-sm text-destructive p-4">{error}</p> : null}

      {!loading && !error ? (
        <div className={cn('grid gap-3 p-4')}>
          <InfoCard icon={Mail} label="Email" value={data.email} hasCopy copyValue={data.email} />
          <InfoCard
            icon={Phone}
            label="Phone Number"
            value={detail?.phoneNumber || '—'}
            hasCopy={Boolean(detail?.phoneNumber)}
            copyValue={detail?.phoneNumber}
          />
          <InfoCard icon={UserIcon} label="Gender" value={detail?.gender || '—'} />

          <InfoCard icon={Mic2} label="Linked artist">
            <AdminUserLinkedArtistFieldLink artistId={artistId} artistName={artistName} />
          </InfoCard>
          <InfoCard icon={Store} label="Linked vendor">
            <AdminUserLinkedVendorFieldLink vendorId={vendorId} vendorName={vendorName} />
          </InfoCard>
          <InfoCard icon={Church} label="Linked pastor">
            <AdminUserLinkedPastorFieldLink pastorId={pastorId} pastorName={pastorName} />
          </InfoCard>
        </div>
      ) : null}

      {data.deleteRequestedAt ? (
        <div className="mx-4 mb-4 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
          Deletion requested on {new Date(data.deleteRequestedAt).toLocaleString()}. Use row actions
          to approve or reject.
        </div>
      ) : null}
    </TableRowDetails>
  );
}
