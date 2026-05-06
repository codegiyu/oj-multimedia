import { describe, expect, it } from 'vitest';
import {
  normalizeEnumValue,
  normalizeOptionalHttpUrl,
  normalizeOptionalText,
  requireText,
} from '@/lib/utils/adminFormValidation';

describe('adminFormValidation', () => {
  it('normalizes enum values with quiet fallback', () => {
    const statuses = ['draft', 'published', 'archived'] as const;

    expect(normalizeEnumValue('published', statuses, 'draft')).toBe('published');
    expect(normalizeEnumValue('invalid-status', statuses, 'draft')).toBe('draft');
    expect(normalizeEnumValue(undefined, statuses, 'draft')).toBe('draft');
  });

  it('normalizes optional text and required text', () => {
    expect(normalizeOptionalText('  hello  ')).toBe('hello');
    expect(normalizeOptionalText('   ')).toBeUndefined();
    expect(requireText('  value ', 'Title')).toBe('value');
    expect(() => requireText('   ', 'Title')).toThrow('Title is required.');
  });

  it('validates optional http URLs', () => {
    expect(normalizeOptionalHttpUrl('https://example.com/file', 'File URL')).toBe(
      'https://example.com/file'
    );
    expect(normalizeOptionalHttpUrl('   ', 'File URL')).toBeUndefined();
    expect(() => normalizeOptionalHttpUrl('ftp://example.com', 'File URL')).toThrow(
      'File URL must start with http:// or https://.'
    );
  });
});
