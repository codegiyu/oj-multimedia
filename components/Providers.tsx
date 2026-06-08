'use client';

import { PropsWithChildren } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { WebVitalsReporter } from '@/components/observability/WebVitalsReporter';
import { SiteSettingsBootstrap } from '@/components/general/SiteSettingsBootstrap';
import { CommunityActionModalsProvider } from '@/components/section/community/shared/CommunityActionModalsProvider';
import { ApiAuthInterceptor } from '@/components/ApiAuthInterceptor';

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <NuqsAdapter>
      <TooltipProvider delayDuration={700} skipDelayDuration={300}>
        <CommunityActionModalsProvider>
          <ApiAuthInterceptor />
          <SiteSettingsBootstrap />
          <WebVitalsReporter />
          {children}
          <Toaster />
        </CommunityActionModalsProvider>
      </TooltipProvider>
    </NuqsAdapter>
  );
};
