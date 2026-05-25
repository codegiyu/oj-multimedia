import { describe, expect, it } from 'vitest';
import {
  MULTILINE_TEXT_FIELD_ENTRIES,
  MULTILINE_TEXT_FIELD_REGISTRY,
  getMultilineFieldsByDisplayScope,
  getMultilineFieldsForEntity,
  getMultilineTextApiKeys,
  isMultilineTextApiKey,
} from '@/lib/constants/multilineTextFields';

describe('multilineTextFields registry', () => {
  it('has at least one field per entity group', () => {
    for (const group of MULTILINE_TEXT_FIELD_REGISTRY) {
      expect(group.fields.length).toBeGreaterThan(0);
    }
  });

  it('uses unique entity+apiKey pairs across the flat list', () => {
    const keys = MULTILINE_TEXT_FIELD_ENTRIES.map(e => `${e.entity}:${e.apiKey}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('includes core prose API keys', () => {
    const apiKeys = getMultilineTextApiKeys();
    expect(apiKeys).toContain('content');
    expect(apiKeys).toContain('description');
    expect(apiKeys).toContain('excerpt');
    expect(apiKeys).toContain('bio');
    expect(apiKeys).toContain('message');
  });

  it('excludes deferred-only keys when includeDeferred is false', () => {
    const all = getMultilineTextApiKeys({ includeDeferred: true });
    const prose = getMultilineTextApiKeys({ includeDeferred: false });
    expect(all).toContain('metaDescription');
    expect(prose).not.toContain('metaDescription');
    expect(prose).not.toContain('keywords');
  });

  it('getMultilineFieldsForEntity returns news excerpt and content', () => {
    const fields = getMultilineFieldsForEntity('news');
    expect(fields.map(f => f.apiKey).sort()).toEqual(['content', 'excerpt']);
  });

  it('getMultilineFieldsByDisplayScope lists public_detail fields', () => {
    const fields = getMultilineFieldsByDisplayScope('public_detail');
    expect(fields.some(f => f.entity === 'testimony' && f.apiKey === 'content')).toBe(true);
    expect(fields.some(f => f.entity === 'news' && f.apiKey === 'content')).toBe(true);
  });

  it('isMultilineTextApiKey respects display scope filter', () => {
    expect(isMultilineTextApiKey('content', { scope: 'public_detail' })).toBe(true);
    expect(isMultilineTextApiKey('metaDescription', { scope: 'public_detail' })).toBe(false);
    expect(isMultilineTextApiKey('metaDescription')).toBe(true);
  });
});
