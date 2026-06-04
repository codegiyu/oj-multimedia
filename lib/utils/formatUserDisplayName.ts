import type { UserListItem } from '@/lib/types/adminUsers';

export function formatUserDisplayName(
  data: Pick<UserListItem, 'firstName' | 'lastName' | 'email'>
): string {
  return [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || data.email;
}
