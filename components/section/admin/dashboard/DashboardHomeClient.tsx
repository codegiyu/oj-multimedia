'use client';

import { useAuthStore } from '@/lib/store/useAuthStore';
import { TrendingUp, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export interface DashboardHomeClientProps {
  serverFirstName?: string | null;
}

export const DashboardHomeClient = ({ serverFirstName = null }: DashboardHomeClientProps) => {
  const { user } = useAuthStore(state => state);

  const stats: Array<{
    title: string;
    value: number;
    icon: typeof Activity;
    color: string;
    href: string;
    loading: boolean;
  }> = [];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="grid gap-8">
      {/* Welcome Section */}
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {greeting()}, {user?.firstName || serverFirstName || 'Admin'}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your site&apos;s content and recent activity.
        </p>
      </div>

      {/* Stats Grid */}
      {stats.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map(stat => (
            <Link
              key={stat.title}
              href={stat.href}
              className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
              <div className="flex items-center justify-between">
                <div className="grid gap-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  {stat.loading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  )}
                </div>
                <div className={`rounded-full p-3 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Quick Actions
            </h2>
          </div>
          <div className="p-6 grid gap-3">
            <QuickActionItem
              href="/admin/dashboard/settings"
              title="Site Settings"
              description="Configure site details"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Site Overview
            </h2>
          </div>
          <div className="p-6 grid gap-4">
            <p className="text-sm text-muted-foreground text-center py-4">
              Site overview information will be available here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickActionItem = ({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) => (
  <Link
    href={href}
    className="block rounded-lg p-3 -mx-3 hover:bg-muted/50 transition-colors group">
    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
      {title}
    </p>
    <p className="text-sm text-muted-foreground">{description}</p>
  </Link>
);
