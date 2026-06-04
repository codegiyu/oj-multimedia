'use client';

import { useState } from 'react';
import { ShieldAlert, Store } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import type { IRolePortalMeta, RolePortalStatus } from '@/lib/types/rolePortal';
import { RoleProfileAppealModal } from './RoleProfileAppealModal';
import type { AllEndpoints } from '@/lib/constants/endpoints';

export interface DashboardRoleAccountStatusPanelProps {
  profileLabel: string;
  portalStatus: RolePortalStatus;
  meta: IRolePortalMeta;
  appealEndpoint: Extract<
    keyof AllEndpoints,
    'VENDOR_SUBMIT_APPEAL' | 'ARTIST_SUBMIT_APPEAL' | 'PASTOR_SUBMIT_APPEAL'
  >;
  onReactivate: () => void | Promise<void>;
  reactivateLoading?: boolean;
  onRefresh: () => void;
}

function formatDate(value?: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleString();
}

export function DashboardRoleAccountStatusPanel({
  profileLabel,
  portalStatus,
  meta,
  appealEndpoint,
  onReactivate,
  reactivateLoading,
  onRefresh,
}: DashboardRoleAccountStatusPanelProps) {
  const [appealOpen, setAppealOpen] = useState(false);
  const isDeactivated = portalStatus === 'deactivated';
  const isSuspended = portalStatus === 'suspended';
  const changedAt = formatDate(meta.statusChangedAt);
  const hasOpenAppeal = Boolean(meta.openAppeal);
  const rejection = meta.lastRejectedAppeal?.adminResponse?.trim();

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card className={isSuspended ? 'border-destructive/30 bg-destructive/5' : 'border-muted'}>
        <CardContent className="p-8 space-y-4">
          <Store className="h-10 w-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold">
            {isDeactivated
              ? `Your ${profileLabel} is deactivated`
              : `Your ${profileLabel} is suspended`}
          </h2>
          {changedAt ? (
            <p className="text-sm text-muted-foreground">Status changed: {changedAt}</p>
          ) : null}
          {isSuspended && meta.suspensionReason ? (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Reason: </span>
              {meta.suspensionReason}
            </p>
          ) : null}
          {isSuspended && rejection ? (
            <div className="rounded-md border border-destructive/20 bg-background p-3 text-sm">
              <p className="font-medium flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-destructive" />
                Last appeal response
              </p>
              <p className="text-muted-foreground mt-1">{rejection}</p>
            </div>
          ) : null}
          {isDeactivated ? (
            <p className="text-sm text-muted-foreground">
              Your profile is hidden from the public site. You can reactivate it at any time.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Your profile is hidden from search and public pages. Contact admin via an appeal if
              you believe this was a mistake.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3 justify-center">
        {isDeactivated ? (
          <RegularBtn
            type="button"
            onClick={() => void onReactivate()}
            disabled={reactivateLoading}>
            {reactivateLoading ? 'Reactivating…' : `Reactivate ${profileLabel}`}
          </RegularBtn>
        ) : null}
        {isSuspended && !hasOpenAppeal ? (
          <RegularBtn type="button" variant="outline" onClick={() => setAppealOpen(true)}>
            Appeal to admin
          </RegularBtn>
        ) : null}
        {isSuspended && hasOpenAppeal ? (
          <p className="text-sm text-muted-foreground w-full text-center">
            Your appeal is pending review.
          </p>
        ) : null}
      </div>

      <RoleProfileAppealModal
        open={appealOpen}
        onOpenChange={setAppealOpen}
        endpoint={appealEndpoint}
        onSubmitted={onRefresh}
      />
    </div>
  );
}
