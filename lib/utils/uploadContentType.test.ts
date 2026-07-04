import { describe, expect, it } from 'vitest';
import { resolveUploadContentType } from './uploadContentType';

describe('resolveUploadContentType', () => {
  it('uses extension-derived MIME when file.type is empty', () => {
    const file = new File([new Uint8Array([0])], 'track.mp3', { type: '' });

    expect(resolveUploadContentType(file)).toBe('audio/mpeg');
  });

  it('prefers extension over application/octet-stream from browser', () => {
    const file = new File([new Uint8Array([0])], 'track.mp3', {
      type: 'application/octet-stream',
    });

    expect(resolveUploadContentType(file)).toBe('audio/mpeg');
  });

  it('uses browser MIME for unknown extensions when present', () => {
    const file = new File([new Uint8Array([0])], 'data.bin', { type: 'application/x-custom' });

    expect(resolveUploadContentType(file)).toBe('application/x-custom');
  });

  it('falls back to application/octet-stream when nothing else applies', () => {
    const file = new File([new Uint8Array([0])], 'data.bin', { type: '' });

    expect(resolveUploadContentType(file)).toBe('application/octet-stream');
  });
});
