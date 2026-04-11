import type { ReactNode } from 'react';
import { ArtistPortalLayoutClient } from './ArtistPortalLayoutClient';

export default function ArtistPortalLayout({ children }: { children: ReactNode }) {
  return <ArtistPortalLayoutClient>{children}</ArtistPortalLayoutClient>;
}
