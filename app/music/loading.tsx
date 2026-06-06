import { MainLayout } from '@/components/layout/MainLayout';
import { MusicHero } from '@/components/section/music/MusicHero';
import { MusicUploadCTA } from '@/components/section/shared/MusicUploadCTA';
import { MusicHubDynamicSectionsSkeleton } from '@/components/section/music/skeletons';

export default function MusicLoading() {
  return (
    <MainLayout>
      <MusicHero />
      <MusicHubDynamicSectionsSkeleton />
      <MusicUploadCTA />
    </MainLayout>
  );
}
