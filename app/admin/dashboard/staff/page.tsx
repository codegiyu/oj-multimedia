import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminsPageClient } from '@/components/section/admin/staff/AdminsPageClient';
import { serverFetchAdminStaffList } from '@/lib/services/adminDashboardServerData';
import { parseAdminStandardListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin staff',
  description: 'Manage admin console staff accounts',
};

function StaffPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading admin staff...</p>
      </div>
    </div>
  );
}

interface StaffPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AdminStaffPage({ searchParams }: StaffPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<StaffPageFallback />}>
            <AdminStaffPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
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
