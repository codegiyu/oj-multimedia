import { describe, expect, it } from 'vitest';
import { buildCommunityListQuery } from './communityListQuery';

describe('buildCommunityListQuery', () => {
  it('includes type and published status for devotionals', () => {
    expect(buildCommunityListQuery({ type: 'popular', publishedOnly: true })).toBe(
      '?limit=50&page=1&status=published&type=popular'
    );
  });

  it('includes testimony list type', () => {
    expect(buildCommunityListQuery({ type: 'latest', limit: 12, page: 2 })).toBe(
      '?limit=12&page=2&type=latest'
    );
  });

  it('includes prayer request status', () => {
    expect(buildCommunityListQuery({ status: 'active', category: 'healing' })).toBe(
      '?limit=50&page=1&status=active&category=healing'
    );
  });

  it('omits category when all', () => {
    expect(buildCommunityListQuery({ status: 'answered', category: 'all' })).toBe(
      '?limit=50&page=1&status=answered'
    );
  });
});
