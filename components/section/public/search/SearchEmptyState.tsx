'use client';

import { motion } from 'motion/react';
import { Search as SearchIcon } from 'lucide-react';
import { useQueryState, parseAsString } from 'nuqs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface SearchEmptyStateProps {
  hasQuery: boolean;
}

export const SearchEmptyState = ({ hasQuery }: SearchEmptyStateProps) => {
  const [query] = useQueryState('q', parseAsString.withDefault(''));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        <SearchIcon className="w-12 h-12 text-muted-foreground" />
      </div>
      {hasQuery ? (
        <>
          <h2 className="text-xl font-semibold text-foreground mb-2">No results found</h2>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            We couldn&apos;t find anything matching &quot;{query}&quot;. Try different keywords or
            browse our categories.
          </p>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/search?category=all">View all categories</Link>
          </Button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-foreground mb-2">Start searching</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Enter a search term to find music, news, videos, and community content.
          </p>
        </>
      )}
    </motion.div>
  );
};
