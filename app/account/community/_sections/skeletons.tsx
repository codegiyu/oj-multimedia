'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function AccountCommunityTabSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      {[1, 2, 3].map(i => (
        <Card key={i} className="p-5 space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </Card>
      ))}
    </div>
  );
}
