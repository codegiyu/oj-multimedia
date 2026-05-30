/** Client-side media probe fields aligned with backend `MediaMetadata`. */
export type ClientMediaMetadata = {
  durationSeconds?: number;
  fileSizeBytes?: number;
  mimeType?: string;
  width?: number;
  height?: number;
};

function loadMediaElement<T extends HTMLMediaElement>(
  file: File,
  createElement: () => T
): Promise<T> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const el = createElement();
    const cleanup = () => {
      URL.revokeObjectURL(url);
      el.removeAttribute('src');
      el.load();
    };

    el.preload = 'metadata';
    el.onloadedmetadata = () => {
      cleanup();
      resolve(el);
    };
    el.onerror = () => {
      cleanup();
      reject(new Error('Could not read media metadata from file'));
    };
    el.src = url;
  });
}

function baseFileFields(file: File): Pick<ClientMediaMetadata, 'fileSizeBytes' | 'mimeType'> {
  return {
    fileSizeBytes: file.size,
    mimeType: file.type || undefined,
  };
}

/** Reads duration and file info from an audio file in the browser. */
export async function readAudioMetadata(file: File): Promise<ClientMediaMetadata> {
  const el = await loadMediaElement(file, () => new Audio());
  const durationSeconds =
    Number.isFinite(el.duration) && el.duration > 0 ? Math.round(el.duration) : undefined;

  return {
    ...baseFileFields(file),
    ...(durationSeconds !== undefined && { durationSeconds }),
  };
}

/** Reads duration, dimensions, and file info from a video file in the browser. */
export async function readVideoMetadata(file: File): Promise<ClientMediaMetadata> {
  const el = await loadMediaElement(file, () => document.createElement('video'));
  const durationSeconds =
    Number.isFinite(el.duration) && el.duration > 0 ? Math.round(el.duration) : undefined;
  const width = el.videoWidth > 0 ? el.videoWidth : undefined;
  const height = el.videoHeight > 0 ? el.videoHeight : undefined;

  return {
    ...baseFileFields(file),
    ...(durationSeconds !== undefined && { durationSeconds }),
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
  };
}
