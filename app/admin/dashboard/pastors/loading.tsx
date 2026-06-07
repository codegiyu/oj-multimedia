import { PageHeader } from '@/components/general/PageHeader';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';

export default function Loading() {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <PageHeader
          title="Pastors"
          description="Manage pastor profiles for Ask a Pastor and community"
        />
        <AdminListPageSkeleton showPageHeader={false} label="Loading pastors..." />
      </section>
    </section>
  );
}
