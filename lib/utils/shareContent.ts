export interface ShareContentOptions {
  title: string;
  text?: string;
  url: string;
}

function resolveShareUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  if (typeof window === 'undefined') {
    return url;
  }

  const path = url.startsWith('/') ? url : `/${url}`;

  return `${window.location.origin}${path}`;
}

/** Web Share API with clipboard fallback for the page URL. */
export async function shareContent({ title, text, url }: ShareContentOptions): Promise<void> {
  const resolvedUrl = resolveShareUrl(url);

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    await navigator.share({ title, text, url: resolvedUrl });
    return;
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(resolvedUrl);
  }
}
