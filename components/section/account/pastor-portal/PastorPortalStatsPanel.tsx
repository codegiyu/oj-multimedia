'use client';

import { DashboardStatCard } from '@/components/layout/user-dashboard';
import { HelpCircle, MessageSquare, Star, ThumbsUp } from 'lucide-react';
import type { IPastorDashboardStatsRes } from '@/lib/constants/endpoints';

interface PastorPortalStatsPanelProps {
  stats: IPastorDashboardStatsRes;
}

export function PastorPortalStatsPanel({ stats }: PastorPortalStatsPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardStatCard
        label="Questions answered"
        value={stats.questionsAnswered ?? 0}
        icon={HelpCircle}
      />
      <DashboardStatCard
        label="Pending questions"
        value={stats.pendingQuestions ?? 0}
        icon={MessageSquare}
      />
      <DashboardStatCard label="Assigned to you" value={stats.assignedQuestions ?? 0} icon={Star} />
      <DashboardStatCard
        label="Community upvotes"
        value={stats.totalUpvotes ?? 0}
        icon={ThumbsUp}
      />
    </div>
  );
}
