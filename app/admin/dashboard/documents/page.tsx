import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  DocumentsPageClient,
  type AdminDocument,
} from '@/components/section/admin/documents/DocumentsPageClient';
import { serverFetchAdminDocumentsList } from '@/lib/services/adminDashboardServerData';
import { parseAdminDocumentsListParams } from '@/lib/utils/adminDashboardSearchParams';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documents',
  description: 'Manage and verify uploaded documents',
};

function DocumentsPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading documents...</p>
      </div>
    </div>
  );
}

interface DocumentsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function DocumentsPage({ searchParams }: DocumentsPageProps) {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <Suspense fallback={<DocumentsPageFallback />}>
            <AdminDocumentsPageServer searchParams={searchParams} />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
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
