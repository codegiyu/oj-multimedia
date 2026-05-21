'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type { AudioPlayer } from './AudioPlayer';

const AudioPlayerLazy = dynamic(
  () => import('./AudioPlayer').then(module => ({ default: module.AudioPlayer })),
  {
    ssr: false,
    loading: () => (
      <div className="h-24 w-full rounded-xl bg-muted animate-pulse" aria-hidden="true" />
    ),
  }
);

export function AudioPlayerDynamic(props: ComponentProps<typeof AudioPlayer>) {
  return <AudioPlayerLazy {...props} />;
}
