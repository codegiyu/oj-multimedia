import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { USER_PASTOR_NAV } from '@/lib/constants/user-dashboard-nav';
import {
  PastorMeSectionSkeleton,
  PastorQuestionsListSectionSkeleton,
} from '@/app/account/pastor-portal/_sections/skeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="Pastor Portal" items={USER_PASTOR_NAV}>
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <PastorMeSectionSkeleton />
        <PastorQuestionsListSectionSkeleton />
      </div>
    </DashboardRouteLoading>
  );
}
