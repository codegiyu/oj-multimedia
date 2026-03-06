/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { ComponentProps, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList } from '@/components/ui/tabs';
import { TablePagination } from './TablePagination';
import { DataTableCard } from './DataTableCard';
import { cn } from '@/lib/utils';
import { useClipboard } from '@/lib/hooks/use-clipboard';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { GhostBtn } from '../atoms/GhostBtn';
import { CheckCheck, Copy, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface DataTableColumnMeta {
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  headerClassName?: string;
  cellClassName?: string;
}

export interface DataTableColumn<TData, TValue = unknown> {
  id: string;
  header: ReactNode;
  cell: (row: TData, index: number) => ReactNode;
  meta?: DataTableColumnMeta;
  accessorKey?: keyof TData;
}

export interface DataTableTab {
  value: string;
  label: string;
}

export interface DataTableProps<TData> {
  title?: string;
  description?: string;
  tabs?: DataTableTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  data: TData[];
  columns: DataTableColumn<TData, unknown>[];
  emptyMessage?: ReactNode;
  emptyStateWord?: string;
  loading?: boolean;
  onRefresh?: () => void;
  headerActions?: ReactNode;
  onRowClick?: (row: TData, index: number) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  className?: string;
  getRowId?: (row: TData, index: number) => string;
}

export const DEFAULT_PAGE_SIZE = 12;

function getWidthStyle(value?: string | number) {
  return typeof value === 'number' ? { width: `${value}px` } : value ? { width: value } : undefined;
}

export function DataTable<TData>({
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  data,
  columns,
  emptyMessage,
  emptyStateWord = 'records',
  loading = false,
  onRefresh,
  headerActions,
  onRowClick,
  pagination,
  className,
  getRowId,
}: DataTableProps<TData>) {
  const isMobile = useIsMobile();

  return (
    <Card
      className={cn(
        'w-full h-full bg-sidebar/75 border-0 pb-2 overflow-hidden',
        `grid ${(tabs && tabs.length > 0) || title || description || onRefresh || headerActions ? 'grid-rows-[auto_1fr]' : ''}`,
        className
      )}>
      {(tabs && tabs.length > 0) || title || description || onRefresh || headerActions ? (
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
                  showNavigation={true}
                />
              </Tabs>
              <div className="flex items-center gap-2">
                {headerActions}
                {onRefresh && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <GhostBtn
                          LucideIcon={RefreshCw}
                          onClick={onRefresh}
                          disabled={loading}
                          className={cn(loading && 'animate-spin')}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh table</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                {title && <CardTitle>{title}</CardTitle>}
                {description && <CardDescription>{description}</CardDescription>}
              </div>
              <div className="flex items-center gap-2">
                {headerActions}
                {onRefresh && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <GhostBtn
                          LucideIcon={RefreshCw}
                          onClick={onRefresh}
                          disabled={loading}
                          className={cn('hover:text-primary', loading && 'animate-spin')}
                          iconClass="size-5 text-current hover:text-primary"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh table</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          )}
        </CardHeader>
      ) : null}

      <CardContent className="w-full h-full px-3 pb-3 overflow-y-auto overflow-x-auto xl:overflow-x-hidden sleek-scrollbar">
        {isMobile ? (
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
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
              ))
            ) : data.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">
                {emptyMessage || `No ${emptyStateWord} found.`}
              </div>
            ) : (
              data.map((row, rowIndex) => (
                <DataTableCard
                  key={getRowId?.(row, rowIndex) ?? rowIndex}
                  data={row}
                  columns={columns}
                  index={rowIndex}
                  tab={activeTab}
                  onRowClick={onRowClick}
                />
              ))
            )}
          </div>
        ) : (
          <div className="w-[1280px] xl:w-full border border-foreground/7 rounded-xl overflow-hidden">
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow>
                  {columns.map(col => {
                    const meta = col.meta;
                    return (
                      <TableHead
                        key={col.id}
                        className={cn(
                          'bg-sidebar/75 border-r border-foreground/7 last:border-r-0',
                          meta?.align === 'center' && 'text-center',
                          meta?.align === 'right' && 'text-right',
                          meta?.headerClassName
                        )}
                        style={getWidthStyle(meta?.width)}>
                        {col.header}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, rowIndex) => (
                    <TableRow key={`skeleton-${rowIndex}`}>
                      {columns.map((col, colIndex) => {
                        const meta = col.meta;
                        return (
                          <TableCell
                            key={colIndex}
                            className={cn(
                              'bg-background border-r border-foreground/7 last:border-r-0 py-2.5 px-4',
                              meta?.align === 'center' && 'text-center',
                              meta?.align === 'right' && 'text-right',
                              meta?.cellClassName
                            )}
                            style={getWidthStyle(meta?.width)}>
                            <Skeleton className="h-6 w-[80%]" />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="py-10 text-center text-muted-foreground">
                      {emptyMessage || `No ${emptyStateWord} found.`}
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, rowIndex) => (
                    <TableRow
                      key={getRowId?.(row, rowIndex) ?? rowIndex}
                      onClick={e => {
                        const target = e.target as HTMLElement;
                        const isInteractive =
                          target.closest('button') !== null ||
                          target.closest('a[href]') !== null ||
                          target.closest('input') !== null ||
                          target.closest('select') !== null ||
                          target.closest('[role="button"]') !== null ||
                          target.closest('[data-slot="dialog-trigger"]') !== null ||
                          target.closest('[data-slot="drawer-trigger"]') !== null;
                        if (!isInteractive && onRowClick) {
                          onRowClick(row, rowIndex);
                        }
                      }}
                      className={
                        onRowClick ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''
                      }>
                      {columns.map(col => {
                        const meta = col.meta;
                        return (
                          <TableCell
                            key={col.id}
                            className={cn(
                              'bg-background border-r border-foreground/7 last:border-r-0',
                              meta?.align === 'center' && 'text-center',
                              meta?.align === 'right' && 'text-right',
                              meta?.cellClassName
                            )}
                            style={getWidthStyle(meta?.width)}>
                            {col.cell(row, rowIndex)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {pagination && pagination.totalPages > 1 && !loading && data.length > 0 && (
        <CardContent className="border-t-0 border-foreground/7 overflow-hidden">
          <TablePagination {...pagination} />
        </CardContent>
      )}
    </Card>
  );
}

interface DataTableColumnHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function DataTableColumnHeader({
  title,
  children,
}: DataTableColumnHeaderProps & { children?: ReactNode }) {
  const displayContent = children ?? title ?? '';
  const tooltipText = title ?? (typeof displayContent === 'string' ? displayContent : '');

  return (
    <div className="flex items-center py-2.5 px-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-sm text-muted-foreground font-semibold overflow-hidden truncate">
            {displayContent}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

interface DataTableCellWrapperProps extends ComponentProps<'div'> {
  text?: ReactNode;
  hasCopy?: boolean;
  copyValue?: string;
  triggerClassName?: string;
}

export const DataTableCellWrapper = ({
  children,
  text,
  hasCopy = false,
  copyValue,
  role = 'cell',
  className = '',
  triggerClassName = '',
}: DataTableCellWrapperProps) => {
  const { copiedValue, copy } = useClipboard();
  const shouldCopy = hasCopy && typeof copyValue === 'string';
  const isCopied = shouldCopy && copyValue && copiedValue === copyValue;
  const tooltipContent = text ?? children ?? '';
  const handleCopy = () => {
    if (!shouldCopy || !copyValue) return;
    copy(copyValue);
  };

  return (
    <div className={cn('py-2.5 px-2.5 h-full w-full', className)} role={role}>
      <Tooltip {...(shouldCopy ? { delayDuration: 550 } : {})}>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'text-[0.9375rem] leading-5 font-normal text-foreground truncate h-full',
              triggerClassName
            )}>
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {shouldCopy ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-background">{tooltipContent}</p>
              <GhostBtn
                onClick={handleCopy}
                className="p-0 rounded-[2px] hover:bg-transparent text-primary hover:text-primary/75"
                LucideIcon={isCopied ? CheckCheck : Copy}
                iconClass="size-4"
              />
            </div>
          ) : (
            <p className="text-sm text-background">{tooltipContent || '—'}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
