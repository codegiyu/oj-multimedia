'use client';

import dynamic from 'next/dynamic';

const LoadAnimationScreenLazy = dynamic(
  () => import('./LoadAnimationScreen').then(module => ({ default: module.LoadAnimationScreen })),
  { ssr: false }
);

export function LoadAnimationScreenDynamic() {
  return <LoadAnimationScreenLazy />;
}
