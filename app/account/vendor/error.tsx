'use client';

import { useEffect } from 'react';
import { VendorDashboardLayoutClient } from './VendorDashboardLayoutClient';
import { reportClientError } from '@/lib/observability/clientErrorReporting';

export default function VendorPortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void reportClientError(error, { digest: error.digest, boundary: 'app/account/vendor/error' });
  }, [error]);

  return (
    <VendorDashboardLayoutClient skipMeFetch>
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
        <h2 className="mb-2 text-xl font-semibold text-foreground">Unable to load vendor page</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Something went wrong while loading your vendor dashboard.
        </p>
        {process.env.NODE_ENV === 'development' && error.message ? (
          <p className="mb-4 font-mono text-xs text-muted-foreground">{error.message}</p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Try again
        </button>
      </div>
    </VendorDashboardLayoutClient>
  );
}
