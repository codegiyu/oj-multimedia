import { PageHeader } from '@/components/general/PageHeader';
import { ContactSubmissionsPageClient } from '@/components/section/admin/contact-submissions/ContactSubmissionsPageClient';
import { serverFetchAdminContactSubmissionsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminStandardListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Contact Submissions',
  description: 'View and manage contact form submissions',
};

interface ContactSubmissionsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function ContactSubmissionsPage({ searchParams }: ContactSubmissionsPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <PageHeader
          title="Contact Submissions"
          description="View and manage messages submitted through the contact form"
        />
        <Suspense
          fallback={
            <AdminListPageSkeleton showPageHeader={false} label="Loading contact submissions..." />
          }>
          <AdminContactSubmissionsPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
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
      pageTitle="Contact Submissions"
      pageDescription="View and manage messages submitted through the contact form"
      submissions={items}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
