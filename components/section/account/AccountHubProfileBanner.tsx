'use client';

import Link from 'next/link';
import { DashboardBanner } from '@/components/layout/user-dashboard';
import { Button } from '@/components/ui/button';
import { Store, ArrowRight, Mic2, BookOpen } from 'lucide-react';
import type { PopulatedUser } from '@/lib/constants/endpoints';
import {
  buildAccountHubPortalCtas,
  type AccountHubPortalCtaKind,
} from '@/lib/account/accountHubPortalCtas';

interface AccountHubProfileBannerProps {
  user: PopulatedUser | null;
}

const CTA_ICONS: Record<AccountHubPortalCtaKind, typeof Store> = {
  vendor: Store,
  artist: Mic2,
  pastor: BookOpen,
  'become-vendor': Store,
};

export function AccountHubProfileBanner({ user }: AccountHubProfileBannerProps) {
  const firstName = user?.firstName?.trim() || '';
  const portalCtas = buildAccountHubPortalCtas(user);

  return (
    <DashboardBanner
      title={firstName ? `Welcome back, ${firstName}!` : 'Welcome back!'}
      description="Here's what's happening with your account."
      className="rounded-2xl">
      <div className="flex flex-wrap gap-2">
        {portalCtas.map(cta => {
          const Icon = CTA_ICONS[cta.kind];

          return (
            <Button
              key={`${cta.kind}-${cta.href}`}
              className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
              asChild>
              <Link href={cta.href} className="gap-2">
                <Icon className="h-4 w-4" />
                {cta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          );
        })}
      </div>
    </DashboardBanner>
  );
}
