import { AdminsPageClient } from '@/components/section/admin/staff/AdminsPageClient';
import { serverFetchAdminStaffList } from '@/lib/services/adminDashboardServerData';
import { parseAdminStandardListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Admin staff',
  description: 'Manage admin console staff accounts',
};

interface StaffPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AdminStaffPage({ searchParams }: StaffPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <Suspense
          fallback={<AdminListPageSkeleton showPageHeader={true} label="Loading admin staff..." />}>
          <AdminStaffPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function AdminStaffPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminStandardListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminStaffList(listParams);

  return (
    <AdminsPageClient
      pageTitle="Admin staff"
      pageDescription="View and manage administrators for the console"
      staff={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
