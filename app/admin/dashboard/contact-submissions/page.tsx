import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { ContactSubmissionsPageClient } from '@/components/section/admin/contact-submissions/ContactSubmissionsPageClient';
import { serverFetchAdminContactSubmissionsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminStandardListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Submissions',
  description: 'View and manage contact form submissions',
};

function ContactSubmissionsPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading contact submissions...</p>
      </div>
    </div>
  );
}

interface ContactSubmissionsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ContactSubmissionsPage({ searchParams }: ContactSubmissionsPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader
            title="Contact Submissions"
            description="View and manage messages submitted through the contact form"
          />
          <Suspense fallback={<ContactSubmissionsPageFallback />}>
            <AdminContactSubmissionsPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function AdminContactSubmissionsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const listParams = parseAdminStandardListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminContactSubmissionsList(listParams);
  return (
    <ContactSubmissionsPageClient
      submissions={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
