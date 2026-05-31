'use client';

import { useCommunityActionModals } from '@/components/section/community/shared/CommunityActionModalsProvider';

export function useOpenShareTestimony() {
  const { openShareTestimony } = useCommunityActionModals();
  return openShareTestimony;
}
