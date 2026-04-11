'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AdminDashboardNotFound() {
  const { back } = useRouter();

  return (
    <DashboardLayout>
      <div className="flex min-h-[min(70vh,32rem)] items-center justify-center px-4">
        <div className="mx-auto grid max-w-lg gap-8 text-center">
          <div className="grid gap-4">
            <h1 className="text-6xl font-bold text-orange md:text-8xl">404</h1>
            <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <RegularBtn
              size="lg"
              linkProps={{ href: '/admin/dashboard/home' }}
              text="Dashboard home"
              LeftIcon={LayoutDashboard}
              leftIconProps={{ className: 'mr-2 w-5' }}
              className="group w-full sm:w-fit"
              wrapClassName="w-full sm:w-fit"
            />
            <RegularBtn
              variant="outline"
              size="lg"
              text="Go back"
              onClick={back}
              LeftIcon={ArrowLeft}
              leftIconProps={{ className: 'mr-2 w-5' }}
              className="group w-full sm:w-fit"
              wrapClassName="w-full sm:w-fit"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
