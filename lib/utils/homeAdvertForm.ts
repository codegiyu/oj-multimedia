import type { UploadResult } from '@/lib/hooks/use-file-upload';
import type {
  IAdminHomeAdvertCreatePayload,
  IAdminHomeAdvertUpdatePayload,
  IHomeAdvertItem,
  IHomeAdvertMutationRes,
} from '@/lib/constants/endpoints';
import { callApi } from '@/lib/services/callApi';
import type { ResponseMessage } from '@/lib/types/http';

export function extractHomeAdvertId(data: IHomeAdvertMutationRes | undefined): string | undefined {
  return data?.advert._id;
}

export type HomeAdvertSaveFields = {
  slot: IHomeAdvertItem['slot'];
  imageUrl: string;
  linkUrl: string;
  displayOrder: number;
  isActive: boolean;
};

type UploadFileFn = (options: {
  file: File;
  entityId: string;
}) => Promise<UploadResult | null | undefined>;

function apiErrorMessage<T extends 'ADMIN_HOME_ADVERTS_CREATE' | 'ADMIN_HOME_ADVERTS_UPDATE'>(
  res: ResponseMessage<T>,
  fallback: string
): string {
  return res.type === 'error' ? res.message || res.error.message || fallback : fallback;
}

/** Create with empty image when a file is pending; upload and patch use the real advert id. */
export async function saveHomeAdvert({
  editId,
  fields,
  pendingFile,
  uploadFile,
}: {
  editId: string | null;
  fields: HomeAdvertSaveFields;
  pendingFile: File | null;
  uploadFile: UploadFileFn;
}): Promise<void> {
  const baseFields: Omit<IAdminHomeAdvertCreatePayload, 'imageUrl'> = {
    slot: fields.slot,
    linkUrl: fields.linkUrl.trim() || undefined,
    displayOrder: fields.displayOrder,
    isActive: fields.isActive,
  };

  if (editId) {
    const imageUrl = await resolveHomeAdvertImageUrl({
      imageUrl: fields.imageUrl,
      pendingFile,
      uploadFile,
      entityId: editId,
    });
    const payload: IAdminHomeAdvertUpdatePayload = { ...baseFields, imageUrl };
    const res = await callApi('ADMIN_HOME_ADVERTS_UPDATE', {
      query: `/${editId}` as `/${string}`,
      payload,
    });
    if (res.type !== 'success') {
      throw new Error(apiErrorMessage(res, 'Failed to update advert'));
    }
    return;
  }

  if (pendingFile) {
    const createRes = await callApi('ADMIN_HOME_ADVERTS_CREATE', {
      payload: { ...baseFields, imageUrl: '' },
    });
    if (createRes.type !== 'success') {
      throw new Error(apiErrorMessage(createRes, 'Failed to create advert'));
    }

    const createdId = extractHomeAdvertId(createRes.data);
    if (!createdId) throw new Error('Create succeeded but no advert id was returned');

    const upload = await uploadFile({ file: pendingFile, entityId: createdId });
    if (!upload?.url) throw new Error('Image upload failed');

    const patchPayload: IAdminHomeAdvertUpdatePayload = { imageUrl: upload.url };
    const patchRes = await callApi('ADMIN_HOME_ADVERTS_UPDATE', {
      query: `/${createdId}` as `/${string}`,
      payload: patchPayload,
    });
    if (patchRes.type !== 'success') {
      throw new Error(apiErrorMessage(patchRes, 'Post-create image update failed'));
    }
    return;
  }

  const imageUrl = fields.imageUrl.trim();
  if (!imageUrl) throw new Error('Image is required');

  const createRes = await callApi('ADMIN_HOME_ADVERTS_CREATE', {
    payload: { ...baseFields, imageUrl },
  });
  if (createRes.type !== 'success') {
    throw new Error(apiErrorMessage(createRes, 'Failed to create advert'));
  }
}

export function hasHomeAdvertImage(
  imageUrl: string,
  pendingFile: File | null | undefined
): boolean {
  return Boolean(imageUrl.trim() || pendingFile);
}

type ResolveHomeAdvertImageUrlOptions = {
  imageUrl: string;
  pendingFile: File | null | undefined;
  uploadFile: UploadFileFn;
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
