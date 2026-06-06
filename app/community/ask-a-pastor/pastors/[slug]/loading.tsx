import { MainLayout } from '@/components/layout/MainLayout';
import { PastorPublicProfileSkeleton } from '@/components/section/community/ask-a-pastor/PastorPublicProfileSkeleton';

export default function PastorPublicProfileLoading() {
  return (
    <MainLayout>
      <PastorPublicProfileSkeleton />
    </MainLayout>
  );
}
