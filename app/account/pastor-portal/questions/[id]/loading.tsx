import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { PastorQuestionDetailSkeleton } from '@/components/section/account/skeletons';
import { USER_PASTOR_NAV } from '@/lib/constants/user-dashboard-nav';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="Pastor Portal" items={USER_PASTOR_NAV}>
      <PastorQuestionDetailSkeleton />
    </DashboardRouteLoading>
  );
}
