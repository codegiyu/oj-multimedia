'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type { ArtistMusicFormModal } from './ArtistMusicFormModal';

const ArtistMusicFormModalLazy = dynamic(
  () => import('./ArtistMusicFormModal').then(m => ({ default: m.ArtistMusicFormModal })),
  { ssr: false }
);

export function ArtistMusicFormModalDynamic(props: ComponentProps<typeof ArtistMusicFormModal>) {
  return <ArtistMusicFormModalLazy {...props} />;
}
