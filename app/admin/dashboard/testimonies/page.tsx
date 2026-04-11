import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TestimoniesPageClient } from '@/components/section/admin/testimonies/TestimoniesPageClient';
import { serverFetchAdminTestimoniesList } from '@/lib/services/adminDashboardServerData';
import { parseAdminStandardListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Testimonies',
  description: 'Manage testimonies',
};

function TestimoniesPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading testimonies...</p>
      </div>
    </div>
  );
}

interface TestimoniesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function TestimoniesPage({ searchParams }: TestimoniesPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<TestimoniesPageFallback />}>
            <AdminTestimoniesPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminTestimoniesPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminStandardListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminTestimoniesList(listParams);
  return (
    <TestimoniesPageClient
      pageTitle="Testimonies"
      pageDescription="Manage testimonies, approve or reject submissions"
      testimonies={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
