'use client';

import { useEffect, useState } from 'react';
import type { SelectOption } from '@/lib/types/general';
import { loadAdminArtistSelectOptions } from '@/lib/utils/adminEntitySelect';

/** Loads artist filter options for admin list pages (`value` = artist `_id`). */
export function useAdminArtistFilterOptions() {
  const [artistOptions, setArtistOptions] = useState<SelectOption[]>([
    { text: 'All artists', value: 'all' },
  ]);

  useEffect(() => {
    void loadAdminArtistSelectOptions().then(options => {
      setArtistOptions([{ text: 'All artists', value: 'all' }, ...options]);
    });
  }, []);

  return artistOptions;
}
