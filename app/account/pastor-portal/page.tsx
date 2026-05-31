import { Suspense } from 'react';
import { PastorPortalOverviewHeader } from '@/components/section/account/pastor-portal/PastorPortalOverviewShell';
import { PastorPortalStatsSection } from './_sections/PastorPortalStatsSection';
import { PastorPortalRecentQuestionsSection } from './_sections/PastorPortalRecentQuestionsSection';
import { PastorPortalMeSection } from './_sections/PastorPortalMeSection';
import {
  PastorPortalStatsSectionSkeleton,
  PastorPortalQuestionsSectionSkeleton,
  PastorMeSectionSkeleton,
} from './_sections/skeletons';

export default function PastorPortalOverviewPage() {
  return (
    <div className="space-y-8">
      <PastorPortalOverviewHeader />

      <Suspense fallback={<PastorMeSectionSkeleton />}>
        <PastorPortalMeSection />
      </Suspense>

      <Suspense fallback={<PastorPortalStatsSectionSkeleton />}>
        <PastorPortalStatsSection />
      </Suspense>

      <Suspense fallback={<PastorPortalQuestionsSectionSkeleton />}>
        <PastorPortalRecentQuestionsSection />
      </Suspense>
    </div>
  );
}
