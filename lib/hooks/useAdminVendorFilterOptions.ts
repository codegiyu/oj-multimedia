'use client';

import { useEffect, useState } from 'react';
import type { SelectOption } from '@/lib/types/general';
import { loadAdminVendorSelectOptions } from '@/lib/utils/adminEntitySelect';

/** Loads vendor filter options for marketplace admin lists. */
export function useAdminVendorFilterOptions() {
  const [vendorOptions, setVendorOptions] = useState<SelectOption[]>([
    { text: 'All vendors', value: 'all' },
  ]);

  useEffect(() => {
    void loadAdminVendorSelectOptions().then(options => {
      setVendorOptions([{ text: 'All vendors', value: 'all' }, ...options]);
    });
  }, []);

  return vendorOptions;
}
