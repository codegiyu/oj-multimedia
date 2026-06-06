import { MainLayout } from '@/components/layout/MainLayout';
import { CommunityDetailPageSkeleton } from '@/app/community/_sections/detailSkeletons';

export default function PrayerRequestDetailLoading() {
  return (
    <MainLayout>
      <CommunityDetailPageSkeleton />
    </MainLayout>
  );
}
