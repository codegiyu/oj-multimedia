import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { AccountFavoritesPageSkeleton } from '@/components/section/account/skeletons';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="My Account" portal="account">
      <AccountFavoritesPageSkeleton />
    </DashboardRouteLoading>
  );
}
