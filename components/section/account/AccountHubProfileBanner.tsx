'use client';

import Link from 'next/link';
import { DashboardBanner } from '@/components/layout/user-dashboard';
import { Button } from '@/components/ui/button';
import { Store, ArrowRight, Mic2, BookOpen } from 'lucide-react';
import type { PopulatedUser } from '@/lib/constants/endpoints';

interface AccountHubProfileBannerProps {
  user: PopulatedUser | null;
}

export function AccountHubProfileBanner({ user }: AccountHubProfileBannerProps) {
  const firstName = user?.firstName?.trim() || '';

  const portalCtas: { href: string; label: string; icon: typeof Store }[] = [];

  if (user?.vendor) {
    portalCtas.push({ href: '/account/vendor', label: 'View vendor dashboard', icon: Store });
  }

  if (user?.artist) {
    portalCtas.push({ href: '/account/artist-portal', label: 'View artist portal', icon: Mic2 });
  }

  if (user?.pastor) {
    portalCtas.push({
      href: '/account/pastor-portal',
      label: 'View pastor portal',
      icon: BookOpen,
    });
  }

  if (portalCtas.length === 0) {
    portalCtas.push({ href: '/account/vendor', label: 'View vendor dashboard', icon: Store });
  }

  return (
    <DashboardBanner
      title={firstName ? `Welcome back, ${firstName}!` : 'Welcome back!'}
      description="Here's what's happening with your account."
      className="rounded-2xl">
      <div className="flex flex-wrap gap-2">
        {portalCtas.map(cta => {
          const Icon = cta.icon;

          return (
            <Button
              key={cta.href}
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
