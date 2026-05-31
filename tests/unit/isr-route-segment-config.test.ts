import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ISR_REVALIDATE } from '@/lib/constants/isr';

const APP_DIR = join(process.cwd(), 'app');

function collectRouteSegmentFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);

    if (statSync(fullPath).isDirectory()) {
      files.push(...collectRouteSegmentFiles(fullPath));
      continue;
    }

    if (entry === 'layout.tsx' || entry === 'page.tsx') {
      files.push(fullPath);
    }
  }

  return files;
}

const ROUTE_SEGMENT_FILES = collectRouteSegmentFiles(APP_DIR);

function readRouteSegmentSource(filePath: string): string {
  return readFileSync(filePath, 'utf8');
}

describe('route segment revalidate exports', () => {
  it('does not re-export or import revalidate (Next.js static analysis requirement)', () => {
    const offenders = ROUTE_SEGMENT_FILES.filter(sourcePath => {
      const source = readRouteSegmentSource(sourcePath);

      return (
        /export\s*\{[^}]*\brevalidate\b/.test(source) ||
        /export const revalidate\s*=\s*ISR_REVALIDATE/.test(source)
      );
    });

    expect(offenders).toEqual([]);
  });

  it('uses literal revalidate values that match ISR tier constants', () => {
    const allowedValues = new Set<number>(Object.values(ISR_REVALIDATE));
    const offenders: string[] = [];

    for (const filePath of ROUTE_SEGMENT_FILES) {
      const source = readRouteSegmentSource(filePath);
      const match = source.match(/export const revalidate\s*=\s*(\d+)/);

      if (!match) {
        continue;
      }

      const value = Number(match[1]);

      if (!allowedValues.has(value)) {
        offenders.push(`${filePath}: revalidate=${value}`);
      }
    }

    expect(offenders).toEqual([]);
  });
});
