/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { RegularSelect } from '@/components/atoms/RegularSelect';
import type { SelectOption } from '@/lib/types/general';
import { createDebouncedCallback } from '@/lib/utils/debouncedCallback';

export const DEFAULT_SEARCH_DEBOUNCE_MS = 350;

export interface FilterConfig {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  loading?: boolean;
}

export interface FilterableDataPageProps {
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  onApplyFilters?: (filters: Record<string, string>) => void;
  /** Controlled search: value from parent (e.g. URL param) */
  searchValue?: string;
  /** When provided, parent controls search; updates are debounced before calling this */
  onSearchChange?: (value: string) => void;
  /** Called when a debounced search commits or Enter is pressed (e.g. reset page) */
  onSearchCommit?: () => void;
  /** @deprecated Use onSearchCommit; kept for backward compatibility */
  onSearchApply?: () => void;
  /** Debounce delay for controlled search URL updates (ms) */
  searchDebounceMs?: number;
  children?: ReactNode;
}

export function FilterableDataPage({
  searchPlaceholder = 'Search...',
  filters = [],
  onApplyFilters,
  searchValue,
  onSearchChange,
  onSearchCommit,
  onSearchApply,
  searchDebounceMs = DEFAULT_SEARCH_DEBOUNCE_MS,
  children,
}: FilterableDataPageProps) {
  const isControlled = searchValue !== undefined;
  const [internalSearch, setInternalSearch] = useState('');
  const [draftSearch, setDraftSearch] = useState(searchValue ?? '');

  const onSearchChangeRef = useRef(onSearchChange);
  const onSearchCommitRef = useRef(onSearchCommit ?? onSearchApply);

  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  useEffect(() => {
    onSearchCommitRef.current = onSearchCommit ?? onSearchApply;
  }, [onSearchCommit, onSearchApply]);

  useEffect(() => {
    if (isControlled) {
      setDraftSearch(searchValue ?? '');
    }
  }, [searchValue, isControlled]);

  const debouncedCommitRef = useRef<ReturnType<typeof createDebouncedCallback<[string]>> | null>(
    null
  );

  useEffect(() => {
    if (!isControlled || !onSearchChange) {
      debouncedCommitRef.current?.cancel();
      debouncedCommitRef.current = null;
      return;
    }

    const debounced = createDebouncedCallback((value: string) => {
      onSearchChangeRef.current?.(value);
      onSearchCommitRef.current?.();
    }, searchDebounceMs);
    debouncedCommitRef.current = debounced;

    return () => {
      debounced.cancel();
    };
  }, [isControlled, onSearchChange, searchDebounceMs]);

  const searchQuery = isControlled ? draftSearch : internalSearch;

  const commitSearchNow = () => {
    if (isControlled && onSearchChange) {
      debouncedCommitRef.current?.flush();
      if (!debouncedCommitRef.current) {
        onSearchChange(draftSearch);
        onSearchCommitRef.current?.();
      }
      return;
    }
    onSearchCommitRef.current?.();
  };

  const handleSearchChange = (value: string) => {
    if (isControlled) {
      setDraftSearch(value);
      debouncedCommitRef.current?.call(value);
      return;
    }

    setInternalSearch(value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitSearchNow();
    }
  };

  const handleApplyFilters = () => {
    if (onApplyFilters && filters.length > 0) {
      const filterValues: Record<string, string> = {};
      filters.forEach(filter => {
        filterValues[filter.label.toLowerCase().replace(/\s+/g, '_')] = filter.value;
      });
      onApplyFilters(filterValues);
    }
  };

  return (
    <Card className="bg-muted/0 border-0 shadow-none py-0 px-0">
      <CardContent className="pt-0 px-0">
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-10 w-full"
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              aria-label={searchPlaceholder}
            />
          </div>

          {filters.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <RegularBtn
                  LeftIcon={Filter}
                  text="Filters"
                  className="w-full sm:w-auto"
                  wrapClassName="w-full sm:w-auto"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-56">
                <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {filters.map((filter, index) => (
                  <div key={index} className="p-2 sm:p-3">
                    <RegularSelect
                      label={filter.label}
                      value={filter.value}
                      onSelectChange={filter.onChange}
                      options={filter.options}
                      loading={filter.loading}
                      wrapClassName="w-full"
                    />
                  </div>
                ))}

                {onApplyFilters ? (
                  <div className="p-2 pt-0 border-t border-border">
                    <RegularBtn
                      text="Apply Filters"
                      variant="default"
                      className="w-full"
                      onClick={handleApplyFilters}
                    />
                  </div>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
