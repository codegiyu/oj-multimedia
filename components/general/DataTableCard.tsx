'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DataTableColumn } from './DataTable';

interface CardField {
  label: string;
  value: ReactNode;
  isPrimary?: boolean;
  isAvatar?: boolean;
  isBadge?: boolean;
  isActions?: boolean;
  isDate?: boolean;
  className?: string;
}

interface DataTableCardProps<TData> {
  data: TData;
  columns: DataTableColumn<TData, unknown>[];
  index: number;
  tab?: string;
  onRowClick?: (row: TData, index: number) => void;
}

export function DataTableCard<TData>({
  data,
  columns,
  index,
  onRowClick,
}: DataTableCardProps<TData>) {
  const fields: CardField[] = columns
    .filter(col => col.id !== 'actions' && col.id !== 'action')
    .map(col => ({
      label:
        typeof col.header === 'string'
          ? col.header
          : col.id
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, s => s.toUpperCase())
              .trim(),
      value: col.cell(data, index),
      isPrimary: false,
      isBadge: col.id.toLowerCase().includes('status') || col.id.toLowerCase().includes('type'),
      isDate:
        col.id.toLowerCase().includes('date') ||
        col.id.toLowerCase().includes('created') ||
        col.id.toLowerCase().includes('updated'),
    }));

  const primaryField = fields[0];
  const regularFields = fields.slice(1).filter(f => !f.isBadge && !f.isDate);
  const badgeAndDateFields = fields.filter(f => f.isBadge || f.isDate);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive =
      target.closest('button') !== null ||
      target.closest('a[href]') !== null ||
      target.closest('[role="button"]') !== null ||
      target.closest('[data-radix-dropdown-menu-trigger]') !== null;
    if (!isInteractive && onRowClick) {
      onRowClick(data, index);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        'cursor-pointer transition-all hover:shadow-md border-foreground/10',
        onRowClick && 'hover:border-foreground/20',
        'w-full'
      )}>
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            {primaryField && (
              <div className="font-semibold text-sm sm:text-base leading-tight break-words">
                {primaryField.value}
              </div>
            )}
          </div>
        </div>

        {regularFields.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-foreground/7">
            {regularFields.slice(0, 4).map((field, idx) => (
              <div key={idx} className="flex flex-col gap-1 min-w-0">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {field.label}
                </span>
                <div className="text-xs sm:text-sm text-foreground break-words line-clamp-3">
                  {field.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {badgeAndDateFields.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-foreground/7">
            {badgeAndDateFields.map((field, idx) => (
              <div key={idx} className="flex-shrink-0">
                {field.isBadge ? (
                  field.value
                ) : (
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    <span className="font-medium">{field.label}:</span> <span>{field.value}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
