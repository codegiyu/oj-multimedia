'use client';

import { useRouter } from 'next/navigation';
import { DataLoadError, type DataLoadErrorProps } from '@/components/general/DataLoadError';

/** Server pages can render this; retry triggers `router.refresh()`. */
export function DataLoadErrorWithRetry({
  title,
  message,
  icon,
}: Omit<DataLoadErrorProps, 'onRetry'>) {
  const router = useRouter();

  return (
    <DataLoadError title={title} message={message} icon={icon} onRetry={() => router.refresh()} />
  );
}
