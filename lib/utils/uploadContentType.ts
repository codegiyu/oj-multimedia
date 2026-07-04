const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  flac: 'audio/flac',
  aac: 'audio/aac',
  m4a: 'audio/mp4',
  ogg: 'audio/ogg',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
};

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1 || lastDot === filename.length - 1) return '';

  return filename.substring(lastDot + 1).toLowerCase();
}

/** Resolve Content-Type for presigned PUT — extension wins over empty or generic browser MIME. */
export function resolveUploadContentType(file: File): string {
  const ext = getFileExtension(file.name);
  const fromExt = ext ? CONTENT_TYPE_BY_EXTENSION[ext] : undefined;

  if (fromExt) return fromExt;

  const browserType = file.type?.trim();
  if (browserType && browserType !== 'application/octet-stream') return browserType;

  return 'application/octet-stream';
}
