'use client';

import Link from 'next/link';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export function PastorPortalOverviewHeader() {
  return (
    <DashboardPageHeader
      title="Pastor overview"
      description="Your ministry dashboard for Ask a Pastor">
      <Button asChild className="rounded-full bg-primary px-5 hover:bg-primary/90">
        <Link href="/account/pastor-portal/questions" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          View questions
        </Link>
      </Button>
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
