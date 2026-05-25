/**
 * Multiline textarea display helpers (hybrid rules):
 * - Blank lines (`\n\n` or more) start a new paragraph
 * - Single `\n` inside a paragraph is a line break when rendered
 *
 * Field inventory (forms → API keys → display scopes):
 * @see {@link MULTILINE_TEXT_FIELD_REGISTRY} in `@/lib/constants/multilineTextFields`
 */

export type {
  MultilineTextDisplayScope,
  MultilineTextFieldEntry,
} from '@/lib/constants/multilineTextFields';
export {
  MULTILINE_TEXT_FIELD_ENTRIES,
  MULTILINE_TEXT_FIELD_REGISTRY,
  getMultilineFieldsByDisplayScope,
  getMultilineFieldsForEntity,
  getMultilineTextApiKeys,
  isMultilineTextApiKey,
} from '@/lib/constants/multilineTextFields';

export function normalizeMultilineInput(text?: string | null): string {
  return (text ?? '').replace(/\r\n/g, '\n').trim();
}

export function splitIntoParagraphs(text?: string | null): string[] {
  const normalized = normalizeMultilineInput(text);

  if (!normalized) return [];

  return normalized.split(/\n{2,}/).filter(Boolean);
}

export function splitParagraphLines(paragraph: string): string[] {
  return paragraph.split('\n');
}
