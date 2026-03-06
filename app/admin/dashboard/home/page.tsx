import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { DashboardHomeClient } from '@/components/section/admin/dashboard/DashboardHomeClient';
import { Metadata } from 'next';

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
          <DashboardHomeClient />
        </section>
      </section>
    </DashboardLayout>
  );
}
