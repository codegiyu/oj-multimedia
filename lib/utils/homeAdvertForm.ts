import type { UploadResult } from '@/lib/hooks/use-file-upload';

export function hasHomeAdvertImage(
  imageUrl: string,
  pendingFile: File | null | undefined
): boolean {
  return Boolean(imageUrl.trim() || pendingFile);
}

type ResolveHomeAdvertImageUrlOptions = {
  imageUrl: string;
  pendingFile: File | null | undefined;
  uploadFile: (options: {
    file: File;
    entityId: string;
  }) => Promise<UploadResult | null | undefined>;
  entityId: string;
};

/** Prefer a pending upload over an existing URL; otherwise use the trimmed URL. */
export async function resolveHomeAdvertImageUrl({
  imageUrl,
  pendingFile,
  uploadFile,
  entityId,
}: ResolveHomeAdvertImageUrlOptions): Promise<string> {
  if (pendingFile) {
    const upload = await uploadFile({ file: pendingFile, entityId });
    if (!upload?.url) throw new Error('Image upload failed');
    return upload.url;
  }

  const trimmed = imageUrl.trim();
  if (!trimmed) throw new Error('Image is required');
  return trimmed;
}
