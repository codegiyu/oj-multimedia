import { MainLayout } from '@/components/layout/MainLayout';
import { MusicDetailPageSkeleton } from './_sections/skeletons';

export default function MusicDetailLoading() {
  return (
    <MainLayout>
      <MusicDetailPageSkeleton />
    </MainLayout>
  );
}
