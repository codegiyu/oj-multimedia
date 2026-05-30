'use client';

import { type ReactNode } from 'react';

export interface PageSkeletonShellProps {
  children: ReactNode;
  label?: string;
  className?: string;
}

export function PageSkeletonShell({
  children,
  label = 'Loading page content',
  className,
}: PageSkeletonShellProps) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className={className}>
      {children}
    </div>
  );
}
