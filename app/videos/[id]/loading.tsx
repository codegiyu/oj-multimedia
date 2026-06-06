import { MainLayout } from '@/components/layout/MainLayout';
import { VideoDetailPageSkeleton } from './_sections/skeletons';

export default function VideoDetailLoading() {
  return (
    <MainLayout>
      <VideoDetailPageSkeleton />
    </MainLayout>
  );
}
