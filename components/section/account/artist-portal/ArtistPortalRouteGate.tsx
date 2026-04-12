'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Mic2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardProfileRequiredPanel } from '@/components/section/account/shared/DashboardProfileRequiredPanel';
import { BecomeArtistModal } from '@/components/section/account/shared/BecomeArtistModal';

export interface ArtistPortalRouteGateProps {
  initialProfileMissing: boolean;
  initialLoadError: string | null;
  children: ReactNode;
}

export function ArtistPortalRouteGate({
  initialProfileMissing,
  initialLoadError,
  children,
}: ArtistPortalRouteGateProps) {
  const router = useRouter();
  const [missing, setMissing] = useState(initialProfileMissing);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setMissing(initialProfileMissing);
  }, [initialProfileMissing]);

  if (initialLoadError && !initialProfileMissing) {
    return (
      <div className="flex min-h-[min(50vh,24rem)] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <p className="max-w-md text-sm text-destructive">{initialLoadError}</p>
        <Button type="button" variant="outline" onClick={() => router.refresh()}>
          Retry
        </Button>
      </div>
    );
  }

  if (missing) {
    return (
      <>
        <DashboardProfileRequiredPanel
          icon={Mic2}
          title="No artist profile yet"
          description="Create an artist profile to manage your music and videos, submit content for publishing, and appear in the community directory."
          actionLabel="Become an artist"
          onAction={() => setModalOpen(true)}
          secondaryHint="You will complete a short form. When your profile is saved, your artist tools unlock automatically."
        />
        <BecomeArtistModal open={modalOpen} onOpenChange={setModalOpen} />
      </>
    );
  }

  return <>{children}</>;
}
