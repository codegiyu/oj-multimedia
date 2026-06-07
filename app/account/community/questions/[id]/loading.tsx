import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { AccountCommunityQuestionDetailSkeleton } from '@/components/section/account/skeletons';
import { USER_ACCOUNT_NAV } from '@/lib/constants/user-dashboard-nav';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="My Community" items={USER_ACCOUNT_NAV}>
      <AccountCommunityQuestionDetailSkeleton />
    </DashboardRouteLoading>
  );
}
