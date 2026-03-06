import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SettingsPageClient } from '@/components/section/admin/settings/SettingsPageClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage site settings and configuration',
};

function SettingsPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading settings...</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<SettingsPageFallback />}>
        <SettingsPageClient />
      </Suspense>
    </DashboardLayout>
  );
}
