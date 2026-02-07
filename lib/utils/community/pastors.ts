import { PASTORS, type Pastor } from '@/lib/constants/community/pastors';

/**
 * Get a pastor by their ID
 * @param id - The pastor's ID
 * @returns The pastor object if found, undefined otherwise
 */
export function getPastorById(id: string): Pastor | undefined {
  return PASTORS.find(pastor => pastor._id === id);
}
