'use client';

import { useEffect } from 'react';
import { reportClientError } from '@/lib/observability/clientErrorReporting';

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    void reportClientError(error, { digest: error.digest, boundary: 'app/account/error' });
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 md:py-20">
      <div className="mx-auto max-w-2xl rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
        <h2 className="mb-2 text-xl font-semibold text-foreground">Unable to load account page</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Something went wrong while loading your account data.
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
    </div>
  );
}
