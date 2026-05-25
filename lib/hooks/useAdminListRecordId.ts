'use client';

import { parseAsString, useQueryState } from 'nuqs';

/** URL `?id=` for admin record drawer deep links (use alongside other nuqs list state). */
export function useAdminListRecordId() {
  const [id, setId] = useQueryState('id', parseAsString.withDefault(''));

  return {
    recordId: id.trim() ? id : null,
    setRecordId: (value: string | null) => {
      void setId(value?.trim() ? value.trim() : '');
    },
    clearRecordId: () => {
      void setId('');
    },
  };
}
