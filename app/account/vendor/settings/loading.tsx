import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { VendorSettingsPageSkeleton } from '@/components/section/account/skeletons';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="Vendor Dashboard" portal="vendor">
      <VendorSettingsPageSkeleton />
    </DashboardRouteLoading>
  );
}
