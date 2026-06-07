import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { DashboardMainSkeleton } from '@/components/section/account/skeletons';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="Pastor Portal" brandSubtitle="Loading…" portal="pastor">
      <DashboardMainSkeleton />
    </DashboardRouteLoading>
  );
}
