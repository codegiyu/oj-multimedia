'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ShareTestimonyModal } from './ShareTestimonyModal';
import { SubmitPrayerRequestModal } from './SubmitPrayerRequestModal';

interface CommunityActionModalsContextValue {
  openShareTestimony: () => void;
  openSubmitPrayerRequest: () => void;
}

const CommunityActionModalsContext = createContext<CommunityActionModalsContextValue | null>(null);

export function CommunityActionModalsProvider({ children }: { children: React.ReactNode }) {
  const [shareTestimonyOpen, setShareTestimonyOpen] = useState(false);
  const [submitPrayerOpen, setSubmitPrayerOpen] = useState(false);

  const openShareTestimony = () => setShareTestimonyOpen(true);
  const openSubmitPrayerRequest = () => setSubmitPrayerOpen(true);

  const value = useMemo(() => ({ openShareTestimony, openSubmitPrayerRequest }), []);

  useEffect(() => {
    const openFromHash = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      if (hash === '#share-testimony') {
        setShareTestimonyOpen(true);
      }
      if (hash === '#submit-prayer-request') {
        setSubmitPrayerOpen(true);
      }
    };

    openFromHash();
    window.addEventListener('hashchange', openFromHash);

    return () => window.removeEventListener('hashchange', openFromHash);
  }, []);

  return (
    <CommunityActionModalsContext.Provider value={value}>
      {children}
      <ShareTestimonyModal open={shareTestimonyOpen} onOpenChange={setShareTestimonyOpen} />
      <SubmitPrayerRequestModal open={submitPrayerOpen} onOpenChange={setSubmitPrayerOpen} />
    </CommunityActionModalsContext.Provider>
  );
}

export function useCommunityActionModals() {
  const context = useContext(CommunityActionModalsContext);
  if (!context) {
    throw new Error('useCommunityActionModals must be used within CommunityActionModalsProvider');
  }

  return context;
}

/** Safe hook for components that may render outside the community layout. */
export function useOptionalCommunityActionModals() {
  return useContext(CommunityActionModalsContext);
}
