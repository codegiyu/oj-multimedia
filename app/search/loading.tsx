import { MainLayout } from '@/components/layout/MainLayout';
import { SearchFormAreaSkeleton } from '@/components/section/public/search/SearchFormSkeleton';
import { SearchResultsSkeleton } from '@/components/section/public/search/SearchResultsSkeleton';

export default function SearchLoading() {
  return (
    <MainLayout>
      <SearchFormAreaSkeleton />
      <div className="container mx-auto px-4 pb-16">
        <SearchResultsSkeleton />
      </div>
    </MainLayout>
  );
}
