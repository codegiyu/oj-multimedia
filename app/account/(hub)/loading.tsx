import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { DashboardMainSkeleton } from '@/components/section/account/skeletons';
import { USER_ACCOUNT_NAV } from '@/lib/constants/user-dashboard-nav';

export default function Loading() {
  return (
    <DashboardRouteLoading
      brandTitle="My Account"
      brandSubtitle="Loading…"
      items={USER_ACCOUNT_NAV}>
      <DashboardMainSkeleton />
    </DashboardRouteLoading>
  );
}
