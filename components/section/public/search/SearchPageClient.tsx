'use client';

import { SearchForm } from './';

export const SearchPageClient = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground text-center mb-6">
            Search Results
          </h1>
          <SearchForm />
        </div>
      </div>
    </div>
  );
};
