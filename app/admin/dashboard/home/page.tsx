import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { DashboardHomeClient } from '@/components/section/admin/dashboard/DashboardHomeClient';
import { callServerApi } from '@/lib/services/serverApi';
import { Metadata } from 'next';
import { AdminDashboardHomeSkeleton } from '@/components/section/admin/skeletons';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Admin dashboard overview',
};

export default function DashboardHomePage() {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader title="Dashboard" description="Overview of your site management" />
          <Suspense fallback={<AdminDashboardHomeSkeleton />}>
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
