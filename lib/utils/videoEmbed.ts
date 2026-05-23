const YOUTUBE_HOST_RE = /(?:youtube\.com|youtu\.be)/i;

/** True when the URL is likely a YouTube watch or embed link (not a direct file). */
export function isLikelyYoutubeUrl(input: string | undefined | null): boolean {
  if (!input || typeof input !== 'string') return false;
  const trimmed = input.trim();
  if (!trimmed) return false;

  try {
    const u = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);

    return YOUTUBE_HOST_RE.test(u.hostname);
  } catch {
    return YOUTUBE_HOST_RE.test(trimmed);
  }
}
