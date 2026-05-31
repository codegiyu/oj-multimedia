import { describe, expect, it } from 'vitest';
import { findRowIndexById } from '@/lib/hooks/useAdminRecordIdDrawer';

describe('useAdminRecordIdDrawer helpers (phase 4c)', () => {
  it('findRowIndexById locates a row by _id', () => {
    const rows = [
      { _id: 'aaa', name: 'One' },
      { _id: 'bbb', name: 'Two' },
    ];

    expect(findRowIndexById(rows, 'bbb', row => row._id)).toBe(1);
    expect(findRowIndexById(rows, 'missing', row => row._id)).toBe(-1);
    expect(findRowIndexById(rows, '', row => row._id)).toBe(-1);
    expect(findRowIndexById(rows, '  ', row => row._id)).toBe(-1);
  });

  it('findRowIndexById trims record id before matching', () => {
    const rows = [{ _id: 'aaa', name: 'One' }];

    expect(findRowIndexById(rows, ' aaa ', row => row._id)).toBe(0);
  });
});
