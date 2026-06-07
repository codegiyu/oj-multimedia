import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { DashboardMainSkeleton } from '@/components/section/account/skeletons';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="Vendor Dashboard" brandSubtitle="Loading…" portal="vendor">
      <DashboardMainSkeleton />
    </DashboardRouteLoading>
  );
}
