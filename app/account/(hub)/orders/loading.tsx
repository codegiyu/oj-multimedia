import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { AccountOrdersPageSkeleton } from '@/components/section/account/skeletons';
import { USER_ACCOUNT_NAV } from '@/lib/constants/user-dashboard-nav';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="My Account" items={USER_ACCOUNT_NAV}>
      <AccountOrdersPageSkeleton />
    </DashboardRouteLoading>
  );
}
