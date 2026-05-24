import { describe, expect, it, vi } from 'vitest';
import { hasHomeAdvertImage, resolveHomeAdvertImageUrl } from '@/lib/utils/homeAdvertForm';

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
