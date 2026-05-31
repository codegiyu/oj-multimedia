'use client';

import { Card } from '@/components/ui/card';
import type { TestimonyDetail } from '@/lib/types/community';

interface AccountCommunityTestimoniesPanelProps {
  testimonies: TestimonyDetail[];
}

export function AccountCommunityTestimoniesPanel({
  testimonies,
}: AccountCommunityTestimoniesPanelProps) {
  if (testimonies.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-muted-foreground">
        No testimonies submitted yet.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {testimonies.map(t => (
        <Card key={t._id} className="p-5">
          <p className="font-medium">{t.author}</p>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{t.content}</p>
        </Card>
      ))}
    </div>
  );
}
