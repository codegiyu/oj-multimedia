import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { DashboardMainSkeleton } from '@/components/section/account/skeletons';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="My Community" brandSubtitle="Loading…" portal="account">
      <DashboardMainSkeleton />
    </DashboardRouteLoading>
  );
}
