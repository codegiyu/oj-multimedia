import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UsersPageClient } from '@/components/section/admin/users/UsersPageClient';
import { serverFetchAdminUsersList } from '@/lib/services/adminDashboardServerData';
import { parseAdminStandardListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage platform user accounts',
};

function UsersPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading users...</p>
      </div>
    </div>
  );
}

interface UsersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function UsersPage({ searchParams }: UsersPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<UsersPageFallback />}>
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
