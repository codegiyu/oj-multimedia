/**
 * Multiline textarea display helpers (hybrid rules):
 * - Blank lines (`\n\n` or more) start a new paragraph
 * - Single `\n` inside a paragraph is a line break when rendered
 *
 * Textarea-backed fields across dashboards/forms typically map to API keys such as
 * content, description, excerpt, bio, lyrics, message, question, answer, storeDescription.
 */

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
