import { MainLayout } from '@/components/layout/MainLayout';
import { VideoHero } from '@/components/section/video/VideoHero';
import { VideoUploadCTA } from '@/components/section/video/VideoUploadCTA';
import { VideosHubDynamicSectionsSkeleton } from './_sections/skeletons';

export default function VideosLoading() {
  return (
    <MainLayout>
      <VideoHero />
      <VideosHubDynamicSectionsSkeleton />
      <VideoUploadCTA />
    </MainLayout>
  );
}
