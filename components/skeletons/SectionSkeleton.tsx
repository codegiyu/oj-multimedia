'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface SectionSkeletonProps {
  children: ReactNode;
  background?: string;
  sectionClassName?: string;
  containerClassName?: string;
  id?: string;
}

export function SectionSkeleton({
  children,
  background,
  sectionClassName,
  containerClassName,
  id,
}: SectionSkeletonProps) {
  return (
    <section id={id} className={cn('py-16 md:py-24', background, sectionClassName)}>
      <div className={cn('container mx-auto px-4', containerClassName)}>{children}</div>
    </section>
  );
}
