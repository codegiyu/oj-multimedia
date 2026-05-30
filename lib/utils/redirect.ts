import { base64UrlDecode } from '@/lib/services/storage';

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

export function resolveRedirectDestination(
  redirectTo: string | null | undefined,
  fallback = '/account'
): string {
  if (!redirectTo) return fallback;

  try {
    return sanitizeInternalRedirect(base64UrlDecode(redirectTo), fallback);
  } catch {
    return fallback;
  }
}
