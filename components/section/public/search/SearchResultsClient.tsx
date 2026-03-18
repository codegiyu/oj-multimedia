'use client';

import { useQueryState, parseAsString } from 'nuqs';
import { SearchFilters, SearchResults, SearchEmptyState } from './';
import type { SearchResultItem } from './SearchResults';
import { AlertCircle } from 'lucide-react';

/** Filter tab value in URL; empty means "all". Server performs filtering. */
export const SEARCH_TYPE_PARAM = 'type';

interface SearchResultsClientProps {
  results: SearchResultItem[];
  errorMessage?: string | null;
}

const COMMUNITY_TYPES = [
  'devotional',
  'testimony',
  'prayer-request',
  'question',
  'poll',
  'resource',
  'artist',
];

export const SearchResultsClient = ({ results, errorMessage = null }: SearchResultsClientProps) => {
  const [query] = useQueryState('q', parseAsString.withDefault(''));
  const [type, setType] = useQueryState(SEARCH_TYPE_PARAM, parseAsString.withDefault(''));

  // Active filter for UI: URL type or 'all'
  const activeFilter = type || 'all';

  const handleFilterChange = (value: string) => {
    setType(value === 'all' ? null : value, { history: 'replace', scroll: false });
  };

  // Counts from current result set (only meaningful when type is 'all')
  const resultsByType = [
    { value: 'music', count: results.filter(r => r.type === 'music').length },
    { value: 'news', count: results.filter(r => r.type === 'news').length },
    { value: 'video', count: results.filter(r => r.type === 'video').length },
    {
      value: 'community',
      count: results.filter(r => COMMUNITY_TYPES.includes(r.type)).length,
    },
  ];

  if (errorMessage) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive px-4 py-4 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {/* Filter Tabs — changes cause new server request (debounced 500ms) */}
      {query && (
        <SearchFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          resultsByType={resultsByType}
        />
      )}

      {/* Results — server-filtered; no client-side filtering */}
      {query ? (
        results.length > 0 ? (
          <SearchResults results={results} />
        ) : (
          <SearchEmptyState hasQuery={true} />
        )
      ) : (
        <SearchEmptyState hasQuery={false} />
      )}
    </div>
  );
};
