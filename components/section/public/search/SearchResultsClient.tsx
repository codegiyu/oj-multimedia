'use client';

import { useState } from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import { SearchFilters, SearchResults, SearchEmptyState } from './';
import type { SearchResultItem } from './SearchResults';

interface SearchResultsClientProps {
  results: SearchResultItem[];
}

export const SearchResultsClient = ({ results }: SearchResultsClientProps) => {
  const [query] = useQueryState('q', parseAsString.withDefault(''));
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter results by active filter
  const filteredResults =
    activeFilter === 'all' ? results : results.filter(item => item.type === activeFilter);

  // Calculate results by type
  const resultsByType = [
    { value: 'music', count: results.filter(r => r.type === 'music').length },
    { value: 'news', count: results.filter(r => r.type === 'news').length },
    { value: 'video', count: results.filter(r => r.type === 'video').length },
    { value: 'community', count: results.filter(r => r.type === 'community').length },
  ];

  return (
    <div className="container mx-auto px-4">
      {/* Filter Tabs */}
      {query && (
        <SearchFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          resultsByType={resultsByType}
        />
      )}

      {/* Results */}
      {query ? (
        filteredResults.length > 0 ? (
          <SearchResults results={filteredResults} />
        ) : (
          <SearchEmptyState hasQuery={true} />
        )
      ) : (
        <SearchEmptyState hasQuery={false} />
      )}
    </div>
  );
};
