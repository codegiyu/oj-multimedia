import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { DashboardMainSkeleton } from '@/components/section/account/skeletons';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="Artist Portal" brandSubtitle="Loading…" portal="artist">
      <DashboardMainSkeleton />
    </DashboardRouteLoading>
  );
}
