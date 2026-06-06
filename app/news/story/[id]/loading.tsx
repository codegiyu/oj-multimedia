import { MainLayout } from '@/components/layout/MainLayout';
import { NewsDetailPageSkeleton } from './_sections/skeletons';

export default function NewsStoryLoading() {
  return (
    <MainLayout>
      <NewsDetailPageSkeleton />
    </MainLayout>
  );
}
