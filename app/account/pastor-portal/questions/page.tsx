import { Suspense } from 'react';
import { PastorPortalQuestionsPageHeader } from '@/components/section/account/pastor-portal/PastorPortalOverviewShell';
import { PastorPortalMeSection } from '../_sections/PastorPortalMeSection';
import { PastorPortalQuestionsListSection } from '../_sections/PastorPortalQuestionsListSection';
import {
  PastorMeSectionSkeleton,
  PastorQuestionsListSectionSkeleton,
} from '../_sections/skeletons';

export default function PastorPortalQuestionsPage() {
  return (
    <div className="space-y-6">
      <PastorPortalQuestionsPageHeader />

      <Suspense fallback={<PastorMeSectionSkeleton />}>
        <PastorPortalMeSection />
      </Suspense>

      <Suspense fallback={<PastorQuestionsListSectionSkeleton />}>
        <PastorPortalQuestionsListSection />
      </Suspense>
    </div>
  );
}
