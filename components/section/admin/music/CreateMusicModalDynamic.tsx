'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type { CreateMusicModal } from './CreateMusicModal';

const CreateMusicModalLazy = dynamic(
  () => import('./CreateMusicModal').then(module => ({ default: module.CreateMusicModal })),
  { ssr: false }
);

export function CreateMusicModalDynamic(props: ComponentProps<typeof CreateMusicModal>) {
  return <CreateMusicModalLazy {...props} />;
}
