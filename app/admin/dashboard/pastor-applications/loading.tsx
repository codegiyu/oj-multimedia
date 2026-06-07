import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';

export default function Loading() {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <AdminListPageSkeleton showPageHeader={true} label="Loading pastor applications..." />
      </section>
    </section>
  );
}
