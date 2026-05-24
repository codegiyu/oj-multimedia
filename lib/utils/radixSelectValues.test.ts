import { describe, expect, it } from 'vitest';
import {
  fromRadixSelectItemValue,
  resolveRadixSelectItemValue,
  toRadixSelectItemValue,
} from './radixSelectValues';

describe('radixSelectValues', () => {
  it('encodes index so duplicate option values get unique Radix item values', () => {
    const first = toRadixSelectItemValue('Option', 0);
    const second = toRadixSelectItemValue('Option', 1);

    expect(first).not.toBe(second);
    expect(fromRadixSelectItemValue(first)).toBe('Option');
    expect(fromRadixSelectItemValue(second)).toBe('Option');
  });

  it('resolves the first matching option when values repeat', () => {
    const items = [{ value: 'Option' }, { value: 'Option' }, { value: 'Gospel' }];

    expect(resolveRadixSelectItemValue(items, 'Option')).toBe(toRadixSelectItemValue('Option', 0));
    expect(resolveRadixSelectItemValue(items, 'Gospel')).toBe(toRadixSelectItemValue('Gospel', 2));
  });
});
