'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useInitSiteStore } from '@/lib/store/siteStore';

const LoadAnimationScreenLazy = dynamic(
  () => import('./LoadAnimationScreen').then(module => ({ default: module.LoadAnimationScreen })),
  { ssr: false }
);

function isSplashEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_ENABLE_SPLASH;

  if (flag === 'true') return true;
  if (flag === 'false') return false;

  // Production defaults off to protect LCP/INP; dev keeps the branded splash unless opted out.
  return process.env.NODE_ENV !== 'production';
}

function ClearSiteLoadingOnMount() {
  useEffect(() => {
    useInitSiteStore.getState().actions.setSiteLoading(false);
  }, []);

  return null;
}

export function LoadAnimationScreenDynamic() {
  if (!isSplashEnabled()) {
    return <ClearSiteLoadingOnMount />;
  }

  return <LoadAnimationScreenLazy />;
}
