'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PageSkeletonShell } from '@/components/skeletons';

export function PastorPublicProfileSkeleton() {
  return (
    <PageSkeletonShell label="Loading pastor profile">
      <article className="min-h-screen">
        <section className="container mx-auto px-4 py-10 max-w-3xl">
          <Button variant="ghost" size="sm" asChild className="gap-2 mb-6 -ml-2">
            <Link href="/community/ask-a-pastor">
              <ArrowLeft className="h-4 w-4" />
              Back to Ask a Pastor
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <Skeleton className="h-32 w-32 shrink-0 rounded-full" />
            <div className="flex-1 space-y-3 w-full">
              <Skeleton className="h-9 w-2/3 max-w-xs" />
              <Skeleton className="h-5 w-1/2 max-w-[200px]" />
              <Skeleton className="h-4 w-1/3 max-w-[160px]" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }, (_, i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-10 w-48 rounded-full" />
            </div>
          </div>

          <div className="mt-10 space-y-3">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="mt-10 space-y-4">
            <Skeleton className="h-7 w-40" />
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="rounded-2xl border border-border/50 p-6 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </section>
      </article>
    </PageSkeletonShell>
  );
}
