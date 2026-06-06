'use client';

import type { ComponentProps, ReactNode } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { SubPageHero } from '@/components/general/SubPageHero';

type PublicBrowseLoadingProps = {
  hero: ComponentProps<typeof SubPageHero>;
  children: ReactNode;
};

export function PublicBrowseLoading({ hero, children }: PublicBrowseLoadingProps) {
  return (
    <MainLayout>
      <SubPageHero {...hero} />
      {children}
    </MainLayout>
  );
}
