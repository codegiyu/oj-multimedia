'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type { VideoPlayer } from './VideoPlayer';

const VideoPlayerLazy = dynamic(
  () => import('./VideoPlayer').then(module => ({ default: module.VideoPlayer })),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-video w-full rounded-2xl bg-muted animate-pulse" aria-hidden="true" />
    ),
  }
);

export function VideoPlayerDynamic(props: ComponentProps<typeof VideoPlayer>) {
  return <VideoPlayerLazy {...props} />;
}
