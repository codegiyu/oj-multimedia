import { describe, expect, it } from 'vitest';
import { favoriteKey } from './favorites';

describe('favoriteKey', () => {
  it('builds stable keys for store lookups', () => {
    expect(favoriteKey('music', '507f1f77bcf86cd799439011')).toBe('music:507f1f77bcf86cd799439011');
    expect(favoriteKey('video', 'clip-1')).toBe('video:clip-1');
  });
});
