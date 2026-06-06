import { MainLayout } from '@/components/layout/MainLayout';
import { SearchPageClient } from '@/components/section/public/search/SearchPageClient';
import { SearchResultsSkeleton } from '@/components/section/public/search/SearchResultsSkeleton';

export default function SearchLoading() {
  return (
    <MainLayout>
      <SearchPageClient />
      <div className="container mx-auto px-4 pb-16">
        <SearchResultsSkeleton />
      </div>
    </MainLayout>
  );
}
