'use client';

import { useState, useEffect, useRef } from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const SearchForm = () => {
  const [queryParam, setQueryParam] = useQueryState('q', parseAsString.withDefault(''));
  const [query, setQuery] = useState(queryParam);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear debounce and update immediately on submit
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    const trimmedQuery = query.trim();
    setQueryParam(trimmedQuery || null, { history: 'replace', scroll: false });
  };

  // Sync local state with URL param when it changes externally
  useEffect(() => {
    if (queryParam !== query) {
      setQuery(queryParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParam]);

  // Debounced URL update
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const trimmedQuery = query.trim();
      setQueryParam(trimmedQuery || null, { history: 'replace', scroll: false });
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <Input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search music, news, videos, community..."
        className="w-full pl-12 pr-24 py-6 text-lg rounded-2xl border-border bg-card"
      />
      <Button type="submit" variant="hero" className="absolute right-2 top-1/2 -translate-y-1/2">
        Search
      </Button>
    </form>
  );
};
