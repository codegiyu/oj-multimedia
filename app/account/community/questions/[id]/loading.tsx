import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { AccountCommunityQuestionDetailSkeleton } from '@/components/section/account/skeletons';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="My Community" portal="account">
      <AccountCommunityQuestionDetailSkeleton />
    </DashboardRouteLoading>
  );
}
