import { MainLayout } from '@/components/layout/MainLayout';
import { SearchFormSkeleton } from '@/components/section/public/search/SearchFormSkeleton';
import { SearchResultsSkeleton } from '@/components/section/public/search/SearchResultsSkeleton';

export default function SearchLoading() {
  return (
    <MainLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-12">
            <SearchFormSkeleton />
          </div>
        </div>
        <div className="container mx-auto px-4">
          <SearchResultsSkeleton />
        </div>
      </div>
    </MainLayout>
  );
}
