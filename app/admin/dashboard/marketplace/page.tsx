import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/general/PageHeader';
import { MarketplacePageClient } from '@/components/section/admin/marketplace/MarketplacePageClient';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Manage vendors, products, and orders',
};

function MarketplacePageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading marketplace...</p>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <DashboardLayout>
      <section className="h-full overflow-hidden">
        <section className="h-full space-y-6 overflow-auto sleek-scrollbar">
          <PageHeader title="Marketplace" description="Manage vendors, products, and orders" />
          <Suspense fallback={<MarketplacePageFallback />}>
            <MarketplacePageClient />
          </Suspense>
        </section>
      </section>
    </DashboardLayout>
  );
}
