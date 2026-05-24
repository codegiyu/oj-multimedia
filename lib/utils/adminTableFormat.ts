import { format } from 'date-fns';

/** Narrow date column for admin tables (`Dec 5, 2025`). */
export const ADMIN_TABLE_DATE_WIDTH = '9rem';

/** Narrow datetime column for admin tables (`Dec 5, 2025 14:30`). */
export const ADMIN_TABLE_DATETIME_WIDTH = '10.5rem';

/** Compact metric badge column (downloads / plays). */
export const ADMIN_TABLE_METRIC_WIDTH = '4.75rem';

export function formatAdminTableDate(
  dateStr?: string | null,
  options?: { dateTime?: boolean }
): string {
  if (!dateStr) return '—';

  try {
    const pattern = options?.dateTime ? 'MMM d, yyyy HH:mm' : 'MMM d, yyyy';
    return format(new Date(dateStr), pattern);
  } catch {
    return '—';
  }
}
