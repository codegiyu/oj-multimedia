'use client';

import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Btns404Page } from '@/components/general/Btns404Page';
import { RegularBtn } from '@/components/atoms/RegularBtn';
import { MainLayout } from '@/components/layout/MainLayout';
import { SectionContainer } from '@/components/general/SectionContainer';
import { reportClientError } from '@/lib/observability/clientErrorReporting';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void reportClientError(error, { digest: error.digest, boundary: 'app/error' });
  }, [error]);

  return (
    <MainLayout hideHeader hideFooter hideScrollToTop>
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <SectionContainer>
          <div className="text-center grid gap-8 mx-auto">
            <div className="grid gap-4">
              <h1 className="text-6xl md:text-8xl font-bold text-orange">500</h1>
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-primary">
                Something went wrong
              </h2>
              <p className="text-lg text-muted-foreground">
                {process.env.NODE_ENV === 'development'
                  ? error.message || 'An unexpected error occurred'
                  : "We're sorry, but something went wrong. Please try again later."}
              </p>
              {error.digest && process.env.NODE_ENV === 'development' && (
                <p className="text-sm text-muted-foreground font-mono">Error ID: {error.digest}</p>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <RegularBtn
                size="lg"
                text="Try Again"
                onClick={reset}
                LeftIcon={RefreshCw}
                leftIconProps={{ className: 'w-5 h-5 mr-2' }}
                className="group w-full sm:w-fit"
                wrapClassName="w-full sm:w-fit"
              />
              <Btns404Page />
            </div>
          </div>
        </SectionContainer>
      </div>
    </MainLayout>
  );
}
