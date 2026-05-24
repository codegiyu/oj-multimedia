'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type { AudioPlayer } from './AudioPlayer';

function AudioPlayerLoading() {
  return (
    <div
      className="min-h-[120px] w-full rounded-2xl border border-border/50 bg-card p-6 shadow-lg"
      aria-hidden="true">
      <div className="mb-4 h-5 w-2/3 max-w-xs rounded bg-muted animate-pulse" />
      <div className="h-[60px] w-full rounded-xl bg-muted animate-pulse" />
    </div>
  );
}

const AudioPlayerLazy = dynamic(
  () => import('./AudioPlayer').then(module => ({ default: module.AudioPlayer })),
  {
    ssr: false,
    loading: AudioPlayerLoading,
  }
);

export function AudioPlayerDynamic(props: ComponentProps<typeof AudioPlayer>) {
  return <AudioPlayerLazy {...props} />;
}
