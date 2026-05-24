import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IHomeAdvertItem } from '@/lib/constants/endpoints';
import {
  extractHomeAdvertId,
  hasHomeAdvertImage,
  resolveHomeAdvertImageUrl,
  saveHomeAdvert,
} from '@/lib/utils/homeAdvertForm';
import { callApi } from '@/lib/services/callApi';

function mockAdvert(overrides: Partial<IHomeAdvertItem> = {}): IHomeAdvertItem {
  return {
    _id: '507f1f77bcf86cd799439011',
    slot: 'after_hero',
    imageUrl: '',
    ...overrides,
  };
}

vi.mock('@/lib/services/callApi', () => ({
  callApi: vi.fn(),
}));

const mockedCallApi = vi.mocked(callApi);

describe('hasHomeAdvertImage', () => {
  it('is true when URL or pending file is present', () => {
    expect(hasHomeAdvertImage('', null)).toBe(false);
    expect(hasHomeAdvertImage('  ', null)).toBe(false);
    expect(hasHomeAdvertImage('https://cdn.example/banner.png', null)).toBe(true);
    expect(hasHomeAdvertImage('', new File(['x'], 'banner.png', { type: 'image/png' }))).toBe(true);
  });
});

describe('resolveHomeAdvertImageUrl', () => {
  it('uploads pending file and returns public URL', async () => {
    const uploadFile = vi.fn().mockResolvedValue({ url: 'https://cdn.example/uploaded.png' });
    const file = new File(['x'], 'banner.png', { type: 'image/png' });

    const url = await resolveHomeAdvertImageUrl({
      imageUrl: '',
      pendingFile: file,
      uploadFile,
      entityId: 'draft-1',
    });

    expect(url).toBe('https://cdn.example/uploaded.png');
    expect(uploadFile).toHaveBeenCalledWith({ file, entityId: 'draft-1' });
  });

  it('returns trimmed URL when no pending file', async () => {
    const uploadFile = vi.fn();
    const url = await resolveHomeAdvertImageUrl({
      imageUrl: '  https://cdn.example/banner.png  ',
      pendingFile: null,
      uploadFile,
      entityId: 'draft-1',
    });

    expect(url).toBe('https://cdn.example/banner.png');
    expect(uploadFile).not.toHaveBeenCalled();
  });

  it('prefers pending upload over existing URL', async () => {
    const uploadFile = vi.fn().mockResolvedValue({ url: 'https://cdn.example/new.png' });
    const file = new File(['x'], 'new.png', { type: 'image/png' });

    const url = await resolveHomeAdvertImageUrl({
      imageUrl: 'https://cdn.example/old.png',
      pendingFile: file,
      uploadFile,
      entityId: '507f1f77bcf86cd799439011',
    });

    expect(url).toBe('https://cdn.example/new.png');
    expect(uploadFile).toHaveBeenCalledOnce();
  });
});

describe('extractHomeAdvertId', () => {
  it('returns advert _id from mutation response', () => {
    expect(extractHomeAdvertId({ advert: mockAdvert() })).toBe('507f1f77bcf86cd799439011');
    expect(extractHomeAdvertId(undefined)).toBeUndefined();
  });
});

describe('saveHomeAdvert', () => {
  const baseFields = {
    slot: 'after_hero' as const,
    imageUrl: '',
    linkUrl: '',
    displayOrder: 0,
    isActive: true,
  };

  beforeEach(() => {
    mockedCallApi.mockReset();
  });

  it('creates with empty image, uploads with real id, then patches', async () => {
    const file = new File(['x'], 'banner.png', { type: 'image/png' });
    const uploadFile = vi.fn().mockResolvedValue({ url: 'https://cdn.example/uploaded.png' });

    mockedCallApi
      .mockResolvedValueOnce({
        type: 'success',
        data: { advert: mockAdvert() },
        message: '',
        requestName: 'ADMIN_HOME_ADVERTS_CREATE',
      })
      .mockResolvedValueOnce({
        type: 'success',
        data: { advert: mockAdvert({ imageUrl: 'https://cdn.example/uploaded.png' }) },
        message: '',
        requestName: 'ADMIN_HOME_ADVERTS_UPDATE',
      });

    await saveHomeAdvert({
      editId: null,
      fields: baseFields,
      pendingFile: file,
      uploadFile,
    });

    expect(mockedCallApi).toHaveBeenNthCalledWith(1, 'ADMIN_HOME_ADVERTS_CREATE', {
      payload: expect.objectContaining({ imageUrl: '' }),
    });
    expect(uploadFile).toHaveBeenCalledWith({
      file,
      entityId: '507f1f77bcf86cd799439011',
    });
    expect(mockedCallApi).toHaveBeenNthCalledWith(2, 'ADMIN_HOME_ADVERTS_UPDATE', {
      query: '/507f1f77bcf86cd799439011',
      payload: { imageUrl: 'https://cdn.example/uploaded.png' },
    });
  });

  it('creates with URL when no pending file', async () => {
    const uploadFile = vi.fn();
    mockedCallApi.mockResolvedValueOnce({
      type: 'success',
      data: { advert: mockAdvert({ _id: 'new', imageUrl: 'https://cdn.example/banner.png' }) },
      message: '',
      requestName: 'ADMIN_HOME_ADVERTS_CREATE',
    });

    await saveHomeAdvert({
      editId: null,
      fields: { ...baseFields, imageUrl: 'https://cdn.example/banner.png' },
      pendingFile: null,
      uploadFile,
    });

    expect(mockedCallApi).toHaveBeenCalledWith('ADMIN_HOME_ADVERTS_CREATE', {
      payload: expect.objectContaining({ imageUrl: 'https://cdn.example/banner.png' }),
    });
    expect(uploadFile).not.toHaveBeenCalled();
  });

  it('updates existing advert with upload before patch', async () => {
    const file = new File(['x'], 'banner.png', { type: 'image/png' });
    const uploadFile = vi.fn().mockResolvedValue({ url: 'https://cdn.example/new.png' });
    mockedCallApi.mockResolvedValueOnce({
      type: 'success',
      data: { advert: mockAdvert({ imageUrl: 'https://cdn.example/new.png' }) },
      message: '',
      requestName: 'ADMIN_HOME_ADVERTS_UPDATE',
    });

    await saveHomeAdvert({
      editId: '507f1f77bcf86cd799439011',
      fields: { ...baseFields, imageUrl: 'https://cdn.example/old.png' },
      pendingFile: file,
      uploadFile,
    });

    expect(uploadFile).toHaveBeenCalledWith({
      file,
      entityId: '507f1f77bcf86cd799439011',
    });
    expect(mockedCallApi).toHaveBeenCalledWith('ADMIN_HOME_ADVERTS_UPDATE', {
      query: '/507f1f77bcf86cd799439011',
      payload: expect.objectContaining({ imageUrl: 'https://cdn.example/new.png' }),
    });
  });
});
