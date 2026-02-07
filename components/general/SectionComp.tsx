'use client';

import { ReactNode } from 'react';
import { SectionHeader, type SectionHeaderProps } from './SectionHeader';
import { SectionContent, type SectionContentProps } from './SectionContent';
import { cn } from '@/lib/utils';

export interface SectionCompProps extends SectionHeaderProps {
  children: ReactNode;
  contentProps?: Omit<SectionContentProps, 'children'>;
  sectionClassName?: string;
  containerClassName?: string;
  background?: string;
  id?: string;
}

export const SectionComp = ({
  children,
  contentProps,
  sectionClassName,
  containerClassName,
  background,
  id,
  ...headerProps
}: SectionCompProps) => {
  return (
    <section id={id} className={cn('py-16 md:py-24', background || '', sectionClassName)}>
      <div className={cn('container mx-auto px-4', containerClassName)}>
        <SectionHeader {...headerProps} />
        <SectionContent {...contentProps}>{children}</SectionContent>
      </div>
    </section>
  );
};
