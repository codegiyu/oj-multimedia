'use client';

import { ArtistPortalLayoutClient } from './ArtistPortalLayoutClient';

export default function ArtistPortalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <ArtistPortalLayoutClient>
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
        <h2 className="mb-2 text-xl font-semibold text-foreground">Unable to load artist portal</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Something went wrong while loading your artist portal.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Try again
        </button>
      </div>
    </ArtistPortalLayoutClient>
  );
}
