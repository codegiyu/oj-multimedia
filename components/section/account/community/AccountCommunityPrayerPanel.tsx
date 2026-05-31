'use client';

import { Card } from '@/components/ui/card';
import type { PrayerRequestDetail } from '@/lib/types/community';

interface AccountCommunityPrayerPanelProps {
  prayerRequests: PrayerRequestDetail[];
}

export function AccountCommunityPrayerPanel({ prayerRequests }: AccountCommunityPrayerPanelProps) {
  if (prayerRequests.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">
        No prayer requests submitted yet.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {prayerRequests.map(p => (
        <Card key={p._id} className="p-5">
          <p className="font-medium">{p.title}</p>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{p.content}</p>
        </Card>
      ))}
    </div>
  );
}
