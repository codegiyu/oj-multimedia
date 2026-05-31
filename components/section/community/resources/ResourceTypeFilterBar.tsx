'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { RESOURCE_TYPES, type ResourceType } from '@/lib/types/community';
import { RESOURCE_TYPE_FILTER_LABELS, type ResourceBrowseFilter } from '@/lib/utils/resourceBrowse';

export type ResourceTypeCounts = {
  all: number;
  byType: Record<ResourceType, number>;
};

interface ResourceTypeFilterBarProps {
  activeType: ResourceBrowseFilter;
  counts: ResourceTypeCounts;
}

function buildFilterHref(
  pathname: string,
  searchParams: URLSearchParams,
  type: ResourceBrowseFilter
): string {
  const params = new URLSearchParams(searchParams.toString());
  params.delete('page');

  if (type === 'all') {
    params.delete('type');
  } else {
    params.set('type', type);
  }

  const q = params.toString();

  return q ? `${pathname}?${q}` : pathname;
}

export function ResourceTypeFilterBar({ activeType, counts }: ResourceTypeFilterBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const chips: { id: ResourceBrowseFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.all },
    ...RESOURCE_TYPES.map(type => ({
      id: type as ResourceBrowseFilter,
      label: RESOURCE_TYPE_FILTER_LABELS[type],
      count: counts.byType[type] ?? 0,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Resource categories">
      {chips.map(chip => {
        const isActive = activeType === chip.id;
        const href = buildFilterHref(pathname, searchParams, chip.id);

        return (
          <Link
            key={chip.id}
            href={href}
            role="tab"
            aria-selected={isActive}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground hover:bg-muted'
            )}>
            {chip.label}
            <Badge
              variant={isActive ? 'secondary' : 'outline'}
              className={cn('tabular-nums', isActive && 'bg-primary-foreground/20 text-inherit')}>
              {chip.count}
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}
