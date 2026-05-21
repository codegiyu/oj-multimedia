'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type { CreateVideoModal } from './CreateVideoModal';

const CreateVideoModalLazy = dynamic(
  () => import('./CreateVideoModal').then(module => ({ default: module.CreateVideoModal })),
  { ssr: false }
);

export function CreateVideoModalDynamic(props: ComponentProps<typeof CreateVideoModal>) {
  return <CreateVideoModalLazy {...props} />;
}
