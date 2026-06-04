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
  /** Rendered after the section heading row and before main content (e.g. in-section tab bars). */
  afterHeader?: ReactNode;
}

export const SectionComp = ({
  children,
  contentProps,
  sectionClassName,
  containerClassName,
  background,
  id,
  afterHeader,
  ...headerProps
}: SectionCompProps) => {
  return (
    <section
      id={id}
      className={cn('py-10 md:py-24 scroll-mt-header', background || '', sectionClassName)}>
      <div className={cn('container mx-auto px-4', containerClassName)}>
        <SectionHeader {...headerProps} />
        {afterHeader}
        <SectionContent {...contentProps}>{children}</SectionContent>
      </div>
    </section>
  );
};
