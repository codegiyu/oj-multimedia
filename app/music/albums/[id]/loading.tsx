import { MainLayout } from '@/components/layout/MainLayout';
import { AlbumDetailPageSkeleton } from './_sections/skeletons';

export default function AlbumDetailLoading() {
  return (
    <MainLayout>
      <AlbumDetailPageSkeleton />
    </MainLayout>
  );
}
