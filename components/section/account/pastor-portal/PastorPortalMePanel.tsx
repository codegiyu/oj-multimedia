'use client';

import type { ClientPastorProfile } from '@/lib/constants/endpoints';

interface PastorPortalMePanelProps {
  pastor: ClientPastorProfile | null;
}

/** Compact pastor context — overview page uses this for profile confirmation. */
export function PastorPortalMePanel({ pastor }: PastorPortalMePanelProps) {
  if (!pastor?.name) {
    return null;
  }

  return (
    <p className="text-sm text-muted-foreground">
      Signed in as <span className="font-medium text-foreground">{pastor.name}</span>
      {pastor.title ? ` · ${pastor.title}` : ''}
    </p>
  );
}
