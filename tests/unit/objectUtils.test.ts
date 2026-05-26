import { describe, expect, it } from 'vitest';
import { omit, pick } from '@/lib/utils/object';
import { capitalizeWord } from '@/lib/utils/string';

describe('object utils', () => {
  it('omit removes listed keys', () => {
    const source = { a: 1, b: 2, c: 3 };

    expect(omit(source, ['b'])).toEqual({ a: 1, c: 3 });
  });

  it('pick keeps only listed keys', () => {
    const source = { a: 1, b: 2, c: 3 };

    expect(pick(source, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });
});

describe('capitalizeWord', () => {
  it('capitalizes like lodash/capitalize', () => {
    expect(capitalizeWord('hello')).toBe('Hello');
    expect(capitalizeWord('HELLO')).toBe('Hello');
  });
});
