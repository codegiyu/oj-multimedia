export function sanitizeInternalRedirect(decoded: string, fallback: string): string {
  if (!decoded) return fallback;

  const candidate = decoded.trim();
  if (!candidate.startsWith('/')) return fallback;

  // Reject protocol-relative and other unsafe variants.
  if (candidate.startsWith('//')) return fallback;
  if (candidate.startsWith('/\\')) return fallback;
  if (candidate.includes('\\')) return fallback;

  // Reject obvious attempts to smuggle an absolute URL.
  if (candidate.includes('://')) return fallback;

  // Prevent newline / header injection style payloads.
  if (/[\r\n]/.test(candidate)) return fallback;

  return candidate;
}
