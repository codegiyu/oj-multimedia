import {
  SERMONS_ITEMS,
  type SermonItem,
  PASTORS,
  type Pastor,
} from '@/lib/constants/community/sermons';

/**
 * Get a sermon item by its ID
 * @param id - The numeric ID of the sermon item
 * @returns The sermon item if found, undefined otherwise
 */
export function getSermonById(id: number): SermonItem | undefined {
  return SERMONS_ITEMS.find(item => item.id === id);
}

/**
 * Get related sermon items based on category or topic
 * @param currentId - The ID of the current sermon item (to exclude)
 * @param category - The category or topic to match
 * @param limit - Maximum number of related items to return (default: 3)
 * @returns Array of related sermon items
 */
export function getRelatedSermons(
  currentId: number,
  category: string,
  limit: number = 3
): SermonItem[] {
  return SERMONS_ITEMS.filter(
    item => item.id !== currentId && (item.category === category || item.topic === category)
  ).slice(0, limit);
}

/**
 * Filter sermons by topic
 * @param topic - The topic to filter by
 * @returns Array of sermons matching the topic
 */
export function filterByTopic(topic: string): SermonItem[] {
  return SERMONS_ITEMS.filter(item => item.topic?.toLowerCase() === topic.toLowerCase());
}

/**
 * Filter sermons by pastor
 * @param pastor - The pastor name to filter by
 * @returns Array of sermons by the pastor
 */
export function filterByPastor(pastor: string): SermonItem[] {
  return SERMONS_ITEMS.filter(item => item.pastor.toLowerCase() === pastor.toLowerCase());
}

/**
 * Get a pastor by their ID
 * @param id - The numeric ID of the pastor
 * @returns The pastor if found, undefined otherwise
 */
export function getPastorById(id: number): Pastor | undefined {
  return PASTORS.find(pastor => pastor.id === id);
}
