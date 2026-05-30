export type CommunityHighlightKind = 'testimony' | 'devotional' | 'prayer-request';

export interface CommunityHighlightItem {
  kind: CommunityHighlightKind;
  _id: string;
  href: string;
  title: string;
  preview: string;
  badge: string;
  author?: string;
  avatar?: string;
  timestamp: number;
  metaLabel?: string;
}

function parseTimestamp(value: unknown): number {
  if (value == null) return 0;
  const parsed = Date.parse(String(value));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function sortByTimestamp<T extends { timestamp: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.timestamp - a.timestamp);
}

export function mergeCommunityHighlights(input: {
  testimonies: Array<Record<string, unknown>>;
  devotionals: Array<Record<string, unknown>>;
  prayerRequests: Array<Record<string, unknown>>;
  limit?: number;
}): CommunityHighlightItem[] {
  const limit = input.limit ?? 6;

  const testimonyItems: CommunityHighlightItem[] = input.testimonies.map(item => ({
    kind: 'testimony',
    _id: String(item._id ?? ''),
    href: `/community/testimonies/${String(item._id ?? item.slug ?? '')}`,
    title: String(item.title ?? item.author ?? 'Testimony'),
    preview: String(item.content ?? ''),
    badge: 'Testimony',
    author: String(item.author ?? item.name ?? 'Community member'),
    avatar: item.avatar ? String(item.avatar) : undefined,
    timestamp: parseTimestamp(item.createdAt ?? item.timeAgo),
    metaLabel: item.likes != null ? `${item.likes} likes` : undefined,
  }));

  const devotionalItems: CommunityHighlightItem[] = input.devotionals.map(item => ({
    kind: 'devotional',
    _id: String(item._id ?? ''),
    href: `/community/devotionals/${String(item.slug ?? item._id ?? '')}`,
    title: String(item.title ?? 'Devotional'),
    preview: String(item.excerpt ?? item.content ?? ''),
    badge: 'Devotional',
    author: String(item.author ?? 'OJ Community'),
    timestamp: parseTimestamp(item.createdAt ?? item.date),
    metaLabel: item.views != null ? `${item.views} views` : undefined,
  }));

  const prayerItems: CommunityHighlightItem[] = input.prayerRequests.map(item => ({
    kind: 'prayer-request',
    _id: String(item._id ?? ''),
    href: `/community/prayer-requests/${String(item._id ?? item.slug ?? '')}`,
    title: String(item.title ?? 'Prayer request'),
    preview: String(item.content ?? ''),
    badge: 'Prayer request',
    author: String(item.author ?? item.name ?? 'Community member'),
    timestamp: parseTimestamp(item.createdAt ?? item.timeAgo),
    metaLabel: item.prayers != null ? `${item.prayers} prayers sent` : undefined,
  }));

  const sortedTestimonies = sortByTimestamp(testimonyItems);
  const sortedDevotionals = sortByTimestamp(devotionalItems);
  const sortedPrayers = sortByTimestamp(prayerItems);

  const merged: CommunityHighlightItem[] = [];
  let t = 0;
  let d = 0;
  let p = 0;

  while (
    merged.length < limit &&
    (t < sortedTestimonies.length || d < sortedDevotionals.length || p < sortedPrayers.length)
  ) {
    if (t < sortedTestimonies.length) {
      merged.push(sortedTestimonies[t]);
      t += 1;
    }
    if (merged.length >= limit) break;

    if (d < sortedDevotionals.length) {
      merged.push(sortedDevotionals[d]);
      d += 1;
    }
    if (merged.length >= limit) break;

    if (p < sortedPrayers.length) {
      merged.push(sortedPrayers[p]);
      p += 1;
    }
  }

  return sortByTimestamp(merged).slice(0, limit);
}
