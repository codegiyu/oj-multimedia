import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { VendorProductsPageSkeleton } from '@/components/section/account/skeletons';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="Vendor Dashboard" portal="vendor">
      <VendorProductsPageSkeleton />
    </DashboardRouteLoading>
  );
}
