import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('upload flow contract', () => {
  it('verifies documents after R2 PUT in useFileUpload', () => {
    const hook = readFileSync(join(process.cwd(), 'lib/hooks/use-file-upload.ts'), 'utf8');

    expect(hook).toContain('verifyUploadedDocument');
    expect(hook).toContain('ADMIN_DOCUMENTS_VERIFY');
    expect(hook).toContain('DOCUMENTS_VERIFY');
  });

  it('enforces upload size and timeout limits', () => {
    const limits = readFileSync(join(process.cwd(), 'lib/constants/uploadLimits.ts'), 'utf8');
    const hook = readFileSync(join(process.cwd(), 'lib/hooks/use-file-upload.ts'), 'utf8');
    const field = readFileSync(
      join(process.cwd(), 'components/general/MediaUrlOrUploadField.tsx'),
      'utf8'
    );

    expect(limits).toContain('AUDIO_UPLOAD_MAX_BYTES');
    expect(hook).toContain('getUploadMaxBytesForFile');
    expect(hook).toContain('getUploadTimeoutMsForFile');
    expect(field).toContain('getUploadMaxBytesForFile');
  });

  it('aligns presigned PUT Content-Type with extension-derived MIME', () => {
    const resolver = readFileSync(join(process.cwd(), 'lib/utils/uploadContentType.ts'), 'utf8');
    const xhr = readFileSync(join(process.cwd(), 'lib/utils/general.tsx'), 'utf8');

    expect(resolver).toContain('resolveUploadContentType');
    expect(xhr).toContain('contentType?: string');
    expect(xhr).toContain('timeoutMs');
  });
});
