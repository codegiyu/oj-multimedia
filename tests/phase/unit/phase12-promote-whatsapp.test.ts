import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const phase12Files = [
  'components/section/shared/CompanyWhatsAppModal.tsx',
  'components/section/community/promote/PromoteYourSong.tsx',
  'components/section/community/promote/GetFeatured.tsx',
] as const;

describe('phase 12 promote page WhatsApp modals', () => {
  it.each(phase12Files)('%s wires promote WhatsApp flow', file => {
    const source = readFileSync(join(process.cwd(), file), 'utf8');
    expect(source.length).toBeGreaterThan(0);

    if (file.endsWith('CompanyWhatsAppModal.tsx')) {
      expect(source).toContain('Continue on WhatsApp');
      expect(source).toContain('buildWhatsAppHref');
    }

    if (file.endsWith('PromoteYourSong.tsx')) {
      expect(source).toContain('CompanyWhatsAppModal');
      expect(source).toContain("type: 'promotion_plan'");
      expect(source).not.toContain('href="/contact"');
    }

    if (file.endsWith('GetFeatured.tsx')) {
      expect(source).toContain('CompanyWhatsAppModal');
      expect(source).toContain("type: 'featured_plan'");
      expect(source).not.toContain('href="/contact"');
    }
  });
});
