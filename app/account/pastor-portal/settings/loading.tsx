import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { PastorPortalSettingsPageSkeleton } from '@/components/section/account/skeletons';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="Pastor Portal" portal="pastor">
      <PastorPortalSettingsPageSkeleton />
    </DashboardRouteLoading>
  );
}
