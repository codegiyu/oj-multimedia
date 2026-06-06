import { MainLayout } from '@/components/layout/MainLayout';
import { ArtistDetailPageSkeleton } from './_sections/skeletons';

export default function ArtistDetailLoading() {
  return (
    <MainLayout>
      <ArtistDetailPageSkeleton />
    </MainLayout>
  );
}
