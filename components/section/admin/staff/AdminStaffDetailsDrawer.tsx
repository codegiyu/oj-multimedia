'use client';

import { useEffect, useState, startTransition } from 'react';
import {
  TableRowDetails,
  type ClickedRowDetails,
} from '@/components/general/TableRowDetailsDrawer';
import { Mail, Shield } from 'lucide-react';
import type { StaffDetail, StaffListItem } from '@/lib/types/adminStaff';
import { InfoCard } from '@/components/general/InfoCard';
import { DashboardThumbnail } from '@/components/general/DashboardThumbnail';
import { callApi } from '@/lib/services/callApi';
import { Badge } from '@/components/ui/badge';

function formatName(data: Pick<StaffListItem, 'firstName' | 'lastName' | 'email'>) {
  return [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || data.email;
}

interface AdminStaffDetailsDrawerProps {
  clickedRowDetails: ClickedRowDetails<StaffListItem, string> | undefined;
  setClickedRowDetails: (d: ClickedRowDetails<StaffListItem, string> | undefined) => void;
  onReinvite?: (row: StaffListItem) => void;
  reinviteLoading?: boolean;
}

export function AdminStaffDetailsDrawer({
  clickedRowDetails,
  setClickedRowDetails,
  onReinvite: _onReinvite,
  reinviteLoading: _reinviteLoading,
}: AdminStaffDetailsDrawerProps) {
  const closeDrawer = () => setClickedRowDetails(undefined);
  const listRow = clickedRowDetails?.data;
  const staffId = listRow?._id ?? null;

  const [detail, setDetail] = useState<StaffDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clickedRowDetails || !staffId) {
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
    void callApi('ADMIN_STAFF_ITEM', { query: `/${staffId}` as `/${string}` })
      .then(res => {
        if (res.type === 'success') {
          setDetail(res.data.staff);
          return;
        }
        setDetail(null);
        setError(res.error?.message ?? 'Could not load staff details.');
      })
      .finally(() => setLoading(false));
  }, [clickedRowDetails, staffId]);

  if (!clickedRowDetails || !listRow) return null;

  const data = detail ?? listRow;
  const displayName = formatName(data);
  return (
    <TableRowDetails
      open={!!clickedRowDetails}
      onOpenChange={val => !val && closeDrawer()}
      title="Admin details"
      data={data as unknown as Record<string, unknown>}
      dataName="staff"
      showMeta={false}
      setShowMeta={() => {}}
      header={
        <div className="flex items-start gap-4">
          <DashboardThumbnail src={data.avatar} alt={displayName} rounded="full" size={80} />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-semibold text-lg truncate">{displayName}</p>
            <p className="text-sm text-muted-foreground truncate">{data.email}</p>
            <Badge variant={data.accountStatus === 'active' ? 'default' : 'secondary'}>
              {data.accountStatus}
            </Badge>
          </div>
        </div>
      }
      footer={
        <>
          {/* CLIENT-HIDDEN: Reinvite — uncomment when invite feature is enabled.
          {data.accountStatus === 'invited' && onReinvite ? (
            <RegularBtn
              text={reinviteLoading ? 'Sending...' : 'Resend invitation'}
              variant="outline"
              className="w-full"
              loading={reinviteLoading}
              disabled={reinviteLoading}
              onClick={() => onReinvite(listRow)}
            />
          ) : null}
          */}
        </>
      }>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading details...</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <div className="space-y-4">
          <InfoCard icon={Mail} label="Email" value={data.email} />
          <InfoCard icon={Shield} label="Roles" value={(data.roleSlugs ?? []).join(', ') || '—'} />
          {detail?.permissions && detail.permissions.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Permissions</p>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                {detail.permissions.slice(0, 12).map(p => (
                  <li key={p.slug}>{p.name || p.slug}</li>
                ))}
                {detail.permissions.length > 12 ? (
                  <li>+{detail.permissions.length - 12} more</li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </TableRowDetails>
  );
}
