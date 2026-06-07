import {
  DocumentsPageClient,
  type AdminDocument,
} from '@/components/section/admin/documents/DocumentsPageClient';
import { serverFetchAdminDocumentsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminDocumentsListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { AdminListPageSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Documents',
  description: 'Manage and verify uploaded documents',
};

interface DocumentsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function DocumentsPage({ searchParams }: DocumentsPageProps) {
  return (
    <section className="h-full overflow-hidden">
      <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
        <Suspense
          fallback={<AdminListPageSkeleton showPageHeader={true} label="Loading documents..." />}>
          <AdminDocumentsPageServer searchParams={searchParams} />
        </Suspense>
      </section>
    </section>
  );
}

async function AdminDocumentsPageServer({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const docParams = parseAdminDocumentsListParams(raw);
  const { items, totalPages, listError } = await serverFetchAdminDocumentsList(docParams);
  return (
    <DocumentsPageClient
      pageTitle="Documents"
      pageDescription="View and verify uploaded documents"
      documents={items as AdminDocument[]}
      totalPages={totalPages}
      listError={listError}
    />
  );
}
