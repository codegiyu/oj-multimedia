import { Suspense } from 'react';
import type { Metadata } from 'next';
import { DashboardStatCard } from '@/components/layout/user-dashboard';
import { ShoppingBag, Store } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AccountHubQuickLinks } from '@/components/section/account/AccountHubQuickLinks';
import { AccountHubProfileSection } from './_sections/AccountHubProfileSection';
import {
  AccountHubOrdersSection,
  AccountHubOrdersStatSection,
} from './_sections/AccountHubOrdersSection';
import {
  AccountHubWishlistSection,
  AccountHubWishlistStatSection,
} from './_sections/AccountHubWishlistSection';
import {
  AccountHubProfileSectionSkeleton,
  AccountHubOrdersSectionSkeleton,
  AccountHubWishlistSectionSkeleton,
} from './_sections/skeletons';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Manage your account and preferences.',
};

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

export default function AccountPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<AccountHubProfileSectionSkeleton />}>
        <AccountHubProfileSection />
      </Suspense>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<StatCardSkeleton />}>
          <AccountHubOrdersStatSection />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <AccountHubWishlistStatSection />
        </Suspense>
        <DashboardStatCard
          label="Marketplace"
          value="Shop"
          hint="Browse vendors"
          icon={ShoppingBag}
        />
        <DashboardStatCard label="Portals" value="2" hint="Artist & vendor" icon={Store} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Suspense fallback={<AccountHubOrdersSectionSkeleton />}>
          <AccountHubOrdersSection />
        </Suspense>
        <Suspense fallback={<AccountHubWishlistSectionSkeleton />}>
          <AccountHubWishlistSection />
        </Suspense>
      </div>

      <AccountHubQuickLinks />
    </div>
  );
}
