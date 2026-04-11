import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { DashboardHomeClient } from '@/components/section/admin/dashboard/DashboardHomeClient';
import { callServerApi } from '@/lib/services/serverApi';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard overview',
};

function DashboardHomeFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}

export default function DashboardHomePage() {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader title="Dashboard" description="Overview of your site management" />
          <Suspense fallback={<DashboardHomeFallback />}>
            <DashboardHomeServer />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}

async function DashboardHomeServer() {
  const res = await callServerApi('ADMIN_GET_ME', {});
  const serverFirstName = res.type === 'success' ? (res.data.user?.firstName ?? null) : null;
  return <DashboardHomeClient serverFirstName={serverFirstName} />;
}
