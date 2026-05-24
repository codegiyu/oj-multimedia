'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type { ArtistVideoFormModal } from './ArtistVideoFormModal';

const ArtistVideoFormModalLazy = dynamic(
  () => import('./ArtistVideoFormModal').then(m => ({ default: m.ArtistVideoFormModal })),
  { ssr: false }
);

export function ArtistVideoFormModalDynamic(props: ComponentProps<typeof ArtistVideoFormModal>) {
  return <ArtistVideoFormModalLazy {...props} />;
}
