import { describe, expect, it } from 'vitest';
import { formatUserDisplayName } from '@/lib/utils/formatUserDisplayName';

describe('formatUserDisplayName', () => {
  it('joins first and last name', () => {
    expect(
      formatUserDisplayName({
        firstName: 'Edward',
        lastName: 'Omegbu',
        email: 'e@example.com',
      })
    ).toBe('Edward Omegbu');
  });

  it('falls back to email when name is empty', () => {
    expect(
      formatUserDisplayName({
        firstName: '',
        lastName: '',
        email: 'e@example.com',
      })
    ).toBe('e@example.com');
  });
});
