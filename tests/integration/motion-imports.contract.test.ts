import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

function walkTsx(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkTsx(fullPath, files);
      continue;
    }
    if (entry.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

describe('motion/react migration contract', () => {
  it('does not import framer-motion in components', () => {
    const root = join(process.cwd(), 'components');
    const offenders = walkTsx(root).filter(file =>
      readFileSync(file, 'utf8').includes('framer-motion')
    );

    expect(offenders).toEqual([]);
  });
});
