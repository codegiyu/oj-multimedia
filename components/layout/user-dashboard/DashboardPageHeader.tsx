'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface DashboardPageHeaderProps {
  title: string;
  description?: string | null;
  className?: string;
  children?: ReactNode;
}

export function DashboardPageHeader({
  title,
  description,
  className,
  children,
}: DashboardPageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6',
        className
      )}>
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground md:text-base">{description}</p>
        ) : null}
      </div>
      {children ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>
      ) : null}
    </div>
  );
}
