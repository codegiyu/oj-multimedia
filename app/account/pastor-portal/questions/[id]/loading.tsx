import { DashboardRouteLoading } from '@/components/loading/DashboardRouteLoading';
import { PastorQuestionDetailSkeleton } from '@/components/section/account/skeletons';

export default function Loading() {
  return (
    <DashboardRouteLoading brandTitle="Pastor Portal" portal="pastor">
      <PastorQuestionDetailSkeleton />
    </DashboardRouteLoading>
  );
}
