import { MainLayout } from '@/components/layout/MainLayout';
import { ResourcesHero } from '@/components/section/community/resources/ResourcesHero';
import { ResourcesBrowseSkeleton } from '@/components/section/community/resources/ResourcesPageSkeleton';

export default function ResourcesLoading() {
  return (
    <MainLayout>
      <ResourcesHero />
      <ResourcesBrowseSkeleton />
    </MainLayout>
  );
}
