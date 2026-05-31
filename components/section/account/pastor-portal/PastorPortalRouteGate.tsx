'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Clock, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { IPastorApplication, PastorPortalState } from '@/lib/constants/endpoints';
import { PastorApplicationForm } from './PastorApplicationForm';

export type PastorPortalGateState = 'none' | 'pending' | 'rejected' | 'approved';

function normalizePortalState(state: PastorPortalState): PastorPortalGateState {
  if (state === 'active') return 'approved';
  if (state === 'pending' || state === 'rejected' || state === 'none') return state;
  return 'none';
}

export interface PastorPortalRouteGateProps {
  initialPortalState: PastorPortalState;
  initialApplication: IPastorApplication | null;
  initialLoadError: string | null;
  children: ReactNode;
}

export function PastorPortalRouteGate({
  initialPortalState,
  initialApplication,
  initialLoadError,
  children,
}: PastorPortalRouteGateProps) {
  const router = useRouter();
  const [portalState, setPortalState] = useState(normalizePortalState(initialPortalState));

  useEffect(() => {
    setPortalState(normalizePortalState(initialPortalState));
  }, [initialPortalState]);

  if (initialLoadError) {
    return (
      <div className="flex min-h-[min(50vh,24rem)] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <p className="max-w-md text-sm text-destructive">{initialLoadError}</p>
        <Button type="button" variant="outline" onClick={() => router.refresh()}>
          Retry
        </Button>
      </div>
    );
  }

  if (portalState === 'approved') {
    return <>{children}</>;
  }

  if (portalState === 'pending') {
    return (
      <Card className="max-w-xl mx-auto border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-8 text-center space-y-4">
          <Clock className="mx-auto h-10 w-10 text-amber-600" />
          <h2 className="text-lg font-semibold">Application under review</h2>
          <p className="text-sm text-muted-foreground">
            Your pastor application was submitted
            {initialApplication?.createdAt
              ? ` on ${new Date(initialApplication.createdAt).toLocaleDateString()}`
              : ''}
            . Our team will review it and unlock your portal when approved.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (portalState === 'rejected') {
    const canReapply = initialApplication?.canReapply !== false;
    const cooldownDays = initialApplication?.cooldownDaysRemaining ?? 0;

    return (
      <div className="max-w-xl mx-auto space-y-6">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-8 space-y-4">
            <ShieldAlert className="h-10 w-10 text-destructive" />
            <h2 className="text-lg font-semibold">Application not approved</h2>
            {initialApplication?.rejectionReason ? (
              <p className="text-sm text-muted-foreground">{initialApplication.rejectionReason}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Your previous application was not approved at this time.
              </p>
            )}
            {!canReapply && (
              <p className="text-sm font-medium text-foreground">
                You may reapply in {cooldownDays} day{cooldownDays === 1 ? '' : 's'}
                {initialApplication?.reapplyAvailableAt
                  ? ` (after ${new Date(initialApplication.reapplyAvailableAt).toLocaleDateString()})`
                  : ''}
                .
              </p>
            )}
          </CardContent>
        </Card>

        {canReapply ? <PastorApplicationForm initialApplication={initialApplication} /> : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center max-w-lg mx-auto space-y-2">
        <BookOpen className="mx-auto h-10 w-10 text-primary" />
        <h2 className="text-xl font-semibold">Become a pastor on OJ</h2>
        <p className="text-sm text-muted-foreground">
          Apply to answer community questions, manage your profile, and serve through Ask a Pastor.
        </p>
      </div>
      <PastorApplicationForm />
    </div>
  );
}
