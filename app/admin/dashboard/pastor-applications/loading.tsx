import { PageHeader } from '@/components/general/PageHeader';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';

export default function Loading() {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <PageHeader
          title="Pastor Applications"
          description="Review and approve pastor portal applications"
        />
        <AdminListPageSkeleton showPageHeader={false} label="Loading pastor applications..." />
      </section>
    </section>
  );
}
