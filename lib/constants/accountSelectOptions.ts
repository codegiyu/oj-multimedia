import type { SelectOption } from '@/lib/types/general';

export const VENDOR_PRODUCT_STATUS_FILTER_SELECT_OPTIONS: ReadonlyArray<SelectOption> = [
  { text: 'All statuses', value: 'all' },
  { text: 'Draft', value: 'draft' },
  { text: 'Published', value: 'published' },
  { text: 'Archived', value: 'archived' },
];
