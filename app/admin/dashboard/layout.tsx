import type { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
