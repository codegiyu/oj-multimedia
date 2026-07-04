import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { describeWithWebServer } from './helpers';

test.describe('admin music upload flow contract', () => {
  test('ships upload flow modules and admin music modal wiring', () => {
    const modal = readFileSync(
      join(process.cwd(), 'components/section/admin/music/CreateMusicModal.tsx'),
      'utf8'
    );
    const hook = readFileSync(join(process.cwd(), 'lib/hooks/use-file-upload.ts'), 'utf8');

    expect(modal).toContain('MediaUrlOrUploadField');
    expect(modal).toContain('intent="other"');
    expect(modal).toContain('accept="audio/*"');
    expect(modal).toContain('Audio upload failed');
    expect(hook).toContain('resolveUploadContentType');
    expect(hook).toContain('verifyUploadedDocument');
  });
});

describeWithWebServer('admin music upload UI @smoke', () => {
  test('admin music route redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/admin/dashboard/music', { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/\/admin\/auth\/login/, { timeout: 20_000 });
    expect(page.url()).toMatch(/\/admin\/auth\/login/);
  });
});
