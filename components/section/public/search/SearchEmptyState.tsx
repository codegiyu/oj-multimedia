'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useQueryState, parseAsString } from 'nuqs';

interface SearchEmptyStateProps {
  hasQuery: boolean;
}

export const SearchEmptyState = ({ hasQuery }: SearchEmptyStateProps) => {
  const [query] = useQueryState('q', parseAsString.withDefault(''));

  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
        <SearchIcon className="w-8 h-8 text-muted-foreground" />
      </div>
      {hasQuery ? (
        <>
          <h2 className="text-xl font-semibold text-foreground mb-2">No results found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn't find anything matching "{query}". Try different keywords or browse our
            categories.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-foreground mb-2">Start searching</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter a search term to find music, news, videos, and community content.
          </p>
        </>
      )}
    </div>
  );
};
