'use client';

import { useState, ReactNode } from 'react';
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

export interface FilterConfig {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  loading?: boolean;
}

interface FilterableDataPageProps {
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  onApplyFilters?: (filters: Record<string, string>) => void;
  children?: ReactNode;
}

export function FilterableDataPage({
  searchPlaceholder = 'Search...',
  filters = [],
  onApplyFilters,
  children,
}: FilterableDataPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

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
              onChange={e => setSearchQuery(e.target.value)}
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

                <div className="p-2 pt-0 border-t border-border">
                  <RegularBtn
                    text="Apply Filters"
                    variant="default"
                    className="w-full"
                    onClick={handleApplyFilters}
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
