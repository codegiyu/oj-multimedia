import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityDetailPageSkeleton } from '@/app/community/_sections/detailSkeletons';

export default function CommunityDevotionalDetailLoading() {
  return (
    <MainLayout>
      <CommunityDetailPageSkeleton />
    </MainLayout>
  );
}
