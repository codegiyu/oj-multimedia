import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { AccountWishlistPageSkeleton } from '@/components/section/account/skeletons';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="My Account" portal="account">
      <AccountWishlistPageSkeleton />
    </DashboardRouteLoading>
  );
}
