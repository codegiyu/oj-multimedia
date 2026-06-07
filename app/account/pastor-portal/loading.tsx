import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { DashboardMainSkeleton } from '@/components/section/account/skeletons';
import { USER_PASTOR_NAV } from '@/lib/constants/user-dashboard-nav';

export default function Loading() {
  return (
    <DashboardRouteLoading
      brandTitle="Pastor Portal"
      brandSubtitle="Loading…"
      items={USER_PASTOR_NAV}>
      <DashboardMainSkeleton />
    </DashboardRouteLoading>
  );
}
