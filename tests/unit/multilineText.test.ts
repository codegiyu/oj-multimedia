import { describe, expect, it } from 'vitest';
import {
  firstParagraphPreview,
  normalizeMultilineInput,
  splitIntoParagraphs,
  splitParagraphLines,
} from '@/lib/utils/multilineText';

describe('multilineText', () => {
  describe('normalizeMultilineInput', () => {
    it('returns empty string for null, undefined, and whitespace-only', () => {
      expect(normalizeMultilineInput(null)).toBe('');
      expect(normalizeMultilineInput(undefined)).toBe('');
      expect(normalizeMultilineInput('   \n  ')).toBe('');
    });

    it('converts CRLF to LF and trims ends', () => {
      expect(normalizeMultilineInput('  hello\r\nworld  ')).toBe('hello\nworld');
    });
  });

  describe('splitIntoParagraphs', () => {
    it('returns empty array for empty input', () => {
      expect(splitIntoParagraphs('')).toEqual([]);
      expect(splitIntoParagraphs(null)).toEqual([]);
    });

    it('keeps single newlines within one paragraph', () => {
      expect(splitIntoParagraphs('Line1\nLine2')).toEqual(['Line1\nLine2']);
    });

    it('splits on blank lines into multiple paragraphs', () => {
      expect(splitIntoParagraphs('Line1\nLine2\n\nLine3')).toEqual(['Line1\nLine2', 'Line3']);
    });

    it('treats multiple blank lines as one paragraph break', () => {
      expect(splitIntoParagraphs('A\n\n\nB')).toEqual(['A', 'B']);
    });

    it('normalizes CRLF before splitting', () => {
      expect(splitIntoParagraphs('First\r\n\r\nSecond')).toEqual(['First', 'Second']);
    });
  });

  describe('firstParagraphPreview', () => {
    it('returns first paragraph with internal newlines collapsed to spaces', () => {
      expect(firstParagraphPreview('Line1\nLine2\n\nLine3')).toBe('Line1 Line2');
    });

    it('truncates when maxLength is set', () => {
      expect(firstParagraphPreview('Hello world', 5)).toBe('Hello…');
    });

    it('returns empty string for empty input', () => {
      expect(firstParagraphPreview('')).toBe('');
    });
  });

  describe('splitParagraphLines', () => {
    it('splits a paragraph on single newlines', () => {
      expect(splitParagraphLines('Line1\nLine2')).toEqual(['Line1', 'Line2']);
    });

    it('returns a single-element array when no newlines', () => {
      expect(splitParagraphLines('Only line')).toEqual(['Only line']);
    });
  });
});
