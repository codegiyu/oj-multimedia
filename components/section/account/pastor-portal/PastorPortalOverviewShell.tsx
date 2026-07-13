'use client';

import Link from 'next/link';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Button } from '@/components/ui/button';
import { MessageSquare, ExternalLink } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import type { PopulatedUser } from '@/lib/constants/endpoints';

export function PastorPortalOverviewHeader() {
  const user = useAuthStore(s => s.user) as PopulatedUser | null;
  const slugOrId = user?.pastor?.slug || user?.pastor?._id;
  const publicHref = slugOrId ? `/community/ask-a-pastor/pastors/${slugOrId}` : null;

  return (
    <DashboardPageHeader
      title="Pastor overview"
      description="Your ministry dashboard for Ask a Pastor">
      <div className="flex flex-wrap gap-2">
        {publicHref ? (
          <Button asChild variant="outline" className="rounded-full px-5">
            <Link href={publicHref} className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View public page
            </Link>
          </Button>
        ) : null}
        <Button asChild className="rounded-full bg-primary px-5 hover:bg-primary/90">
          <Link href="/account/pastor-portal/questions" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            View questions
          </Link>
        </Button>
      </div>
    </DashboardPageHeader>
  );
}

export function PastorPortalQuestionsPageHeader() {
  return (
    <DashboardPageHeader
      title="Questions inbox"
      description="Answer questions directed to you, from the open pool, or review your past answers"
    />
  );
}
