/** Parse admin comma-separated tags field into a trimmed string array. */
export function parseCommaSeparatedTags(input: string): string[] {
  if (!input.trim()) return [];

  return input
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
}

/** Format API tags for the comma-separated admin input. */
export function formatTagsForInput(tags: string[] | undefined): string {
  if (!tags?.length) return '';
  return tags.join(', ');
}
