import { PageHeader } from '@/components/general/PageHeader';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { RoleProfileAppealsPageClient } from '@/components/section/admin/role-profile-appeals/RoleProfileAppealsPageClient';
import { serverFetchAdminRoleProfileAppealsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminStandardListParams } from '@/lib/utils/adminDashboardSearchParams';

export const metadata: Metadata = {
  title: 'Profile appeals',
  description: 'Review vendor, artist, and pastor suspension appeals',
};

interface RoleProfileAppealsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function RoleProfileAppealsPage({ searchParams }: RoleProfileAppealsPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <PageHeader
          title="Profile appeals"
          description="Review suspension appeals from vendors, artists, and pastors"
        />
        <Suspense
          fallback={
            <AdminListPageSkeleton showPageHeader={false} label="Loading profile appeals..." />
          }>
          <RoleProfileAppealsPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function RoleProfileAppealsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminStandardListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminRoleProfileAppealsList(listParams);

  return (
    <RoleProfileAppealsPageClient
      pageTitle="Profile appeals"
      pageDescription="Review suspension appeals from vendors, artists, and pastors"
      appeals={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
