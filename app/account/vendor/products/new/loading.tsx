import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { VendorProductFormPageSkeleton } from '@/components/section/account/skeletons';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="Vendor Dashboard" portal="vendor">
      <VendorProductFormPageSkeleton />
    </DashboardRouteLoading>
  );
}
