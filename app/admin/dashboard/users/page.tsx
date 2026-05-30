import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UsersPageClient } from '@/components/section/admin/users/UsersPageClient';
import { serverFetchAdminUsersList } from '@/lib/services/adminDashboardServerData';
import { parseAdminStandardListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage platform user accounts',
};

interface UsersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function UsersPage({ searchParams }: UsersPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<AdminListPageSkeleton label="Loading users..." />}>
            <AdminUsersPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminUsersPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminStandardListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminUsersList(listParams);

  return (
    <UsersPageClient
      pageTitle="Users"
      pageDescription="Search, review, and manage platform user accounts"
      users={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
