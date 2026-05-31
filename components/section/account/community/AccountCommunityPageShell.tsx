'use client';

import { useState } from 'react';
import { DashboardPageHeader } from '@/components/layout/user-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AccountCommunityPageShellProps {
  questionsPanel: React.ReactNode;
  testimoniesPanel: React.ReactNode;
  prayerPanel: React.ReactNode;
  pollsPanel: React.ReactNode;
}

export function AccountCommunityPageShell({
  questionsPanel,
  testimoniesPanel,
  prayerPanel,
  pollsPanel,
}: AccountCommunityPageShellProps) {
  const [activeTab, setActiveTab] = useState('questions');

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My community"
        description="Questions, testimonies, prayer requests, and polls you've submitted"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="questions">My Questions</TabsTrigger>
          <TabsTrigger value="testimonies">Testimonies</TabsTrigger>
          <TabsTrigger value="prayer-requests">Prayer Requests</TabsTrigger>
          <TabsTrigger value="polls">My Polls</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-6">
          {questionsPanel}
        </TabsContent>

        <TabsContent value="testimonies" className="mt-6">
          {testimoniesPanel}
        </TabsContent>

        <TabsContent value="prayer-requests" className="mt-6">
          {prayerPanel}
        </TabsContent>

        <TabsContent value="polls" className="mt-6">
          {pollsPanel}
        </TabsContent>
      </Tabs>
    </div>
  );
}
