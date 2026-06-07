'use client';

import { useRouter } from 'next/navigation';
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';
import type { AllBrowseConfig } from '@/lib/constants/allBrowseConfig';

type ContentAllBrowseStatusFilterProps = {
  config: AllBrowseConfig;
};

export function ContentAllBrowseStatusFilter({ config }: ContentAllBrowseStatusFilterProps) {
  const router = useRouter();
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault('all'));
  const [, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  if (!config.statusFilterOptions?.length) {
    return null;
  }

  const handleChange = async (value: string) => {
    await setStatus(value === 'all' ? null : value);
    await setPage(1);
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Status:</span>
      {config.statusFilterOptions.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => void handleChange(option.value)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            status === option.value
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground hover:bg-muted/80'
          }`}>
          {option.label}
        </button>
      ))}
    </div>
  );
}
