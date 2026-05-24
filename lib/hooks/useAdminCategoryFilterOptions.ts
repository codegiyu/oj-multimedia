'use client';

import { useEffect, useState } from 'react';
import type { SelectOption } from '@/lib/types/general';
import {
  loadAdminContentCategorySelectOptions,
  type AdminContentCategoryScope,
} from '@/lib/utils/adminContentCategorySelect';

/** Loads content-category filter options for an admin list page. */
export function useAdminCategoryFilterOptions(scope: AdminContentCategoryScope) {
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([
    { text: 'All', value: 'all' },
  ]);

  useEffect(() => {
    void loadAdminContentCategorySelectOptions(scope).then(options => {
      setCategoryOptions([{ text: 'All', value: 'all' }, ...options.filter(o => o.value)]);
    });
  }, [scope]);

  return categoryOptions;
}
