import { AdminDashboardNotFound } from '@/components/section/admin/AdminDashboardNotFound';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: "The page you're looking for doesn't exist.",
};

/**
 * Catches unknown paths under /admin so they render inside AdminAuthWrapper + dashboard
 * chrome instead of the global not-found (which uses the public site layout).
 */
export default function AdminCatchAllNotFoundPage() {
  return <AdminDashboardNotFound />;
}
