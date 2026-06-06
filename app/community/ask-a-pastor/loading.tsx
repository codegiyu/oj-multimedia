import { MainLayout } from '@/components/layout/MainLayout';
import { AskAPastorHero } from '@/components/section/community/ask-a-pastor/AskAPastorHero';
import { CommunityCTA } from '@/components/section/shared';
import {
  ActiveQuestionsSectionSkeleton,
  AskAPastorHubSupplementSectionSkeleton,
} from './_sections/skeletons';

export default function AskAPastorLoading() {
  return (
    <MainLayout>
      <AskAPastorHero />
      <ActiveQuestionsSectionSkeleton />
      <AskAPastorHubSupplementSectionSkeleton />
      <CommunityCTA />
    </MainLayout>
  );
}
