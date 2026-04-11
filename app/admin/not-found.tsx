import { AdminDashboardNotFound } from '@/components/section/admin/AdminDashboardNotFound';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: "The page you're looking for doesn't exist.",
};

export default function AdminNotFound() {
  return <AdminDashboardNotFound />;
}
