'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ListPagination } from '@/components/general/ListPagination';
import type { Pagination } from '@/lib/types/pagination';

export interface ContentBrowseListProps {
  children: ReactNode;
  pagination?: Pagination | null;
  toolbar?: ReactNode;
  className?: string;
  gridClassName?: string;
  id?: string;
}

export function ContentBrowseList({
  children,
  pagination = null,
  toolbar,
  className,
  gridClassName,
  id,
}: ContentBrowseListProps) {
  const showPagination = pagination != null && pagination.totalPages > 1;

  return (
    <section id={id} className={cn('py-12', className)}>
      <div className="container mx-auto px-4">
        {toolbar ? <div className="mb-8">{toolbar}</div> : null}
        <div className={gridClassName}>{children}</div>
        {showPagination && pagination ? (
          <div className="mt-10">
            <ListPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
