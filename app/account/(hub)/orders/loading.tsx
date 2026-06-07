import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { AccountOrdersPageSkeleton } from '@/components/section/account/skeletons';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="My Account" portal="account">
      <AccountOrdersPageSkeleton />
    </DashboardRouteLoading>
  );
}
