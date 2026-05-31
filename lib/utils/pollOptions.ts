/** Client-side duplicate check (mirrors backend normalizePollOptionTexts). */
export function hasDuplicatePollOptions(options: string[]): boolean {
  const seen = new Set<string>();
  for (const raw of options) {
    const key = raw.trim().toLowerCase();
    if (!key) continue;
    if (seen.has(key)) return true;
    seen.add(key);
  }
  return false;
}
