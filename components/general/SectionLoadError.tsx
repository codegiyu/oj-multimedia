'use client';

import { DataLoadErrorWithRetry } from '@/components/general/DataLoadErrorWithRetry';

interface SectionLoadErrorProps {
  title?: string;
  message?: string;
}

/** Compact inline error for a single streamed page section; retry refreshes the route. */
export function SectionLoadError({
  title = 'Section unavailable',
  message = 'This section failed to load.',
}: SectionLoadErrorProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <DataLoadErrorWithRetry title={title} message={message} />
    </div>
  );
}
