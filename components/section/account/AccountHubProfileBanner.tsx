'use client';

import Link from 'next/link';
import { DashboardBanner } from '@/components/layout/user-dashboard';
import { Button } from '@/components/ui/button';
import { Store, ArrowRight } from 'lucide-react';
import type { PopulatedUser } from '@/lib/constants/endpoints';

interface AccountHubProfileBannerProps {
  user: PopulatedUser | null;
}

export function AccountHubProfileBanner({ user }: AccountHubProfileBannerProps) {
  const firstName = user?.firstName?.trim() || '';

  return (
    <DashboardBanner
      title={firstName ? `Welcome back, ${firstName}!` : 'Welcome back!'}
      description="Here's what's happening with your account."
      className="rounded-2xl">
      <Button
        className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
        asChild>
        <Link href="/account/vendor" className="gap-2">
          <Store className="h-4 w-4" />
          View vendor dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </DashboardBanner>
  );
}
