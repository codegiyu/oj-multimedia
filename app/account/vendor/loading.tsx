import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { DashboardMainSkeleton } from '@/components/section/account/skeletons';
import { USER_VENDOR_NAV } from '@/lib/constants/user-dashboard-nav';

export default function Loading() {
  return (
    <DashboardRouteLoading
      brandTitle="Vendor Dashboard"
      brandSubtitle="Loading…"
      items={USER_VENDOR_NAV}>
      <DashboardMainSkeleton />
    </DashboardRouteLoading>
  );
}
