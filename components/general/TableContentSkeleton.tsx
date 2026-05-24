'use client';

import { type DataTableColumn, type DataTableTab } from './DataTable';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsList } from '@/components/ui/tabs';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  getDataTableColumnWidthStyle,
  getDataTableHugClassName,
} from '@/lib/utils/dataTableColumnMeta';

interface TableContentSkeletonProps<TData> {
  columns: DataTableColumn<TData, unknown>[];
  tabs?: DataTableTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  onRefresh?: () => void;
  rowCount?: number;
}

export function TableContentSkeleton<TData>({
  columns,
  tabs,
  activeTab,
  onTabChange,
  onRefresh,
  rowCount = 6,
}: TableContentSkeletonProps<TData>) {
  const isMobile = useIsMobile();

  return (
    <Card className="w-full h-full bg-sidebar/75 border-0 pb-0 overflow-hidden grid grid-rows-[auto_1fr]">
      {(tabs && tabs.length > 0) || onRefresh ? (
        <CardHeader className="px-3">
          {tabs && tabs.length > 0 ? (
            <div className="flex items-center justify-between gap-4">
              <Tabs
                value={activeTab ?? ''}
                onValueChange={onTabChange ?? (() => {})}
                className="flex-1">
                <TabsList
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={onTabChange}
                  showNavigation
                />
              </Tabs>
              {onRefresh && <Skeleton className="h-9 w-9 rounded-md" />}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              {onRefresh && <Skeleton className="h-9 w-9 rounded-md ml-auto" />}
            </div>
          )}
        </CardHeader>
      ) : null}

      <CardContent className="w-full h-full px-3 pb-3 overflow-y-auto overflow-x-auto xl:overflow-x-hidden sleek-scrollbar">
        {isMobile ? (
          <div className="space-y-4">
            {Array.from({ length: rowCount }).map((_, index) => (
              <Card key={`skeleton-${index}`} className="animate-pulse">
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-foreground/7">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="w-[1280px] xl:w-full border border-foreground/7 rounded-xl overflow-hidden">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  {columns.map((column, colIndex) => {
                    const meta = column.meta;
                    return (
                      <th
                        key={colIndex}
                        className={cn(
                          'bg-sidebar/75 border-r border-foreground/7 last:border-r-0 py-2.5 px-4',
                          getDataTableHugClassName(meta),
                          meta?.align === 'center' && 'text-center',
                          meta?.align === 'right' && 'text-right',
                          meta?.headerClassName
                        )}
                        style={getDataTableColumnWidthStyle(meta)}>
                        <Skeleton className="h-4 w-20" />
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rowCount }).map((_, rowIndex) => (
                  <tr key={`skeleton-${rowIndex}`}>
                    {columns.map((column, colIndex) => {
                      const meta = column.meta;
                      return (
                        <td
                          key={colIndex}
                          className={cn(
                            'bg-background border-r border-foreground/7 last:border-r-0 p-0',
                            getDataTableHugClassName(meta),
                            meta?.align === 'center' && 'text-center',
                            meta?.align === 'right' && 'text-right',
                            meta?.cellClassName
                          )}
                          style={getDataTableColumnWidthStyle(meta)}>
                          <Skeleton className="h-6 w-[80%]" />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
