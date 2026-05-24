import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DevotionalsPageClient } from '@/components/section/admin/devotionals/DevotionalsPageClient';
import { serverFetchAdminDevotionalsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminContentListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Devotionals',
  description: 'Manage devotionals',
};

function DevotionalsPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading devotionals...</p>
      </div>
    </div>
  );
}

interface DevotionalsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function DevotionalsPage({ searchParams }: DevotionalsPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<DevotionalsPageFallback />}>
            <AdminDevotionalsPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminDevotionalsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminContentListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminDevotionalsList(listParams);
  return (
    <DevotionalsPageClient
      pageTitle="Devotionals"
      pageDescription="Manage devotionals, approve or reject submissions"
      devotionals={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
