import { POLLS_ITEMS, type PollItem } from '@/lib/constants/community/polls';

/**
 * Get a poll item by its ID
 * @param id - The ID of the poll item (string from URL)
 * @returns The poll item if found, undefined otherwise
 */
export function getPollById(id: string): PollItem | undefined {
  if (!id) return undefined;
  return POLLS_ITEMS.find(item => item._id === id);
}

/**
 * Filter polls by status
 * @param status - The status to filter by ('active' or 'closed')
 * @returns Array of polls matching the status
 */
export function filterByStatus(status: 'active' | 'closed'): PollItem[] {
  return POLLS_ITEMS.filter(item => item.status === status);
}
