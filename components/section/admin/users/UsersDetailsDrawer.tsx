'use client';

import { useEffect, useState, startTransition } from 'react';
import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { Mail, Shield, User as UserIcon, Store, Mic2 } from 'lucide-react';
import type { UserDetail, UserListItem } from '@/lib/types/adminUsers';
import { InfoCard } from '@/components/general/InfoCard';
import { DashboardThumbnail } from '@/components/general/DashboardThumbnail';
import { callApi } from '@/lib/services/callApi';
import { Badge } from '@/components/ui/badge';
import {
  AdminUserLinkedArtistFieldLink,
  AdminUserLinkedVendorFieldLink,
} from '@/components/section/admin/shared';

function formatName(data: Pick<UserListItem, 'firstName' | 'lastName' | 'email'>) {
  return [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || data.email;
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

    /* eslint-disable-next-line react-hooks/set-state-in-effect -- drawer fetch lifecycle */
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
  const displayName = formatName(data);

  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="User details"
      data={data as unknown as Record<string, unknown>}
      dataName="user"
      showMeta={false}
      setShowMeta={() => {}}
      header={
        <div className="flex items-start gap-4">
          <DashboardThumbnail
            src={data.avatar}
            alt={displayName}
            rounded="full"
            className="h-16 w-16 shrink-0"
          />
          <div className="min-w-0 space-y-1">
            <p className="font-semibold text-lg truncate">{displayName}</p>
            <p className="text-sm text-muted-foreground truncate">{data.email}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant={data.accountStatus === 'active' ? 'default' : 'secondary'}>
                {data.accountStatus}
              </Badge>
              {data.deleteRequestedAt ? (
                <Badge variant="destructive">Deletion requested</Badge>
              ) : null}
            </div>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-foreground/7" />
      }>
      {loading ? <p className="text-sm text-muted-foreground">Loading details…</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard icon={UserIcon} label="Phone" value={detail?.phoneNumber || '—'} />
        <InfoCard icon={Mail} label="Last login" value={data.lastLogin ?? '—'} />
        <InfoCard
          icon={Shield}
          label="Roles"
          value={detail?.roleSlugs?.length ? detail.roleSlugs.join(', ') : '—'}
        />
        <InfoCard
          icon={Shield}
          label="KYC"
          value={
            detail
              ? `Email ${detail.kycEmailVerified ? 'verified' : 'unverified'} · Phone ${
                  detail.kycPhoneVerified ? 'verified' : 'unverified'
                }`
              : '—'
          }
        />
        <InfoCard icon={Mic2} label="Linked artist">
          <AdminUserLinkedArtistFieldLink
            artistId={detail?.linkedArtist?._id ?? data.artistId}
            artistName={data.linkedArtistName || detail?.linkedArtist?.name}
          />
        </InfoCard>
        <InfoCard icon={Store} label="Linked vendor">
          <AdminUserLinkedVendorFieldLink
            vendorId={detail?.linkedVendor?._id ?? data.vendorId}
            vendorName={data.linkedVendorName || detail?.linkedVendor?.storeName}
          />
        </InfoCard>
      </div>

      {data.deleteRequestedAt ? (
        <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
          Deletion requested on {new Date(data.deleteRequestedAt).toLocaleString()}. Use row actions
          to approve or reject.
        </div>
      ) : null}
    </TableRowDetails>
  );
}
