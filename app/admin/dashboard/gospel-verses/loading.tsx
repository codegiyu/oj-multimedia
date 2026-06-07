import { PageHeader } from '@/components/general/PageHeader';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';

export default function Loading() {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <PageHeader
          title="Gospel Verses"
          description="Review and manage scheduled gospel verses for the site"
        />
        <AdminListPageSkeleton showPageHeader={false} label="Loading gospel verses..." />
      </section>
    </section>
  );
}
