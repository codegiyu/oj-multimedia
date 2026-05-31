import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AskAPastorHero } from '@/components/section/community/ask-a-pastor/AskAPastorHero';
import { CommunityCTA } from '@/components/section/shared';
import { ActiveQuestionsSection } from './_sections/ActiveQuestionsSection';
import { AskAPastorHubSupplementSection } from './_sections/AskAPastorHubSupplementSection';
import {
  ActiveQuestionsSectionSkeleton,
  AskAPastorHubSupplementSectionSkeleton,
} from './_sections/skeletons';

export const metadata: Metadata = {
  title: 'Ask a Pastor - Get Biblical Guidance',
  description:
    'Submit your questions to our pastors, browse answered questions, and get biblical guidance on faith, life, and spiritual matters.',
};

export default function CommunityAskAPastorPage() {
  return (
    <MainLayout>
      <AskAPastorHero />
      <Suspense fallback={<ActiveQuestionsSectionSkeleton />}>
        <ActiveQuestionsSection />
      </Suspense>
      <Suspense fallback={<AskAPastorHubSupplementSectionSkeleton />}>
        <AskAPastorHubSupplementSection />
      </Suspense>
      <CommunityCTA />
    </MainLayout>
  );
}
