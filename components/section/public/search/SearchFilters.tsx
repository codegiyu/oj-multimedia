'use client';

import { useQueryState, parseAsString } from 'nuqs';
import { Music, Newspaper, Video, Users, Filter } from 'lucide-react';

const typeFilters = [
  { value: 'all', label: 'All', icon: Filter },
  { value: 'music', label: 'Music', icon: Music },
  { value: 'news', label: 'News', icon: Newspaper },
  { value: 'video', label: 'Videos', icon: Video },
  { value: 'community', label: 'Community', icon: Users },
];

interface SearchFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  resultsByType: Array<{ value: string; count: number }>;
}

export const SearchFilters = ({
  activeFilter,
  onFilterChange,
  resultsByType,
}: SearchFiltersProps) => {
  const [query] = useQueryState('q', parseAsString.withDefault(''));
  const hasQuery = !!query;

  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
      {typeFilters.map(filter => {
        const count =
          filter.value === 'all'
            ? resultsByType.reduce((sum, r) => sum + r.count, 0)
            : resultsByType.find(r => r.value === filter.value)?.count || 0;

        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
              activeFilter === filter.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}>
            <filter.icon className="w-4 h-4" />
            {filter.label}
            {hasQuery && <span className="text-xs opacity-70">({count})</span>}
          </button>
        );
      })}
    </div>
  );
};
