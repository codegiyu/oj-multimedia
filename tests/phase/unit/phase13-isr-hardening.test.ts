import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const APP_ROOT = join(process.cwd(), 'app');

const EXCLUDED_PREFIXES = ['admin/', 'account/', 'api/'];

function walkPageFiles(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      walkPageFiles(fullPath, files);
      continue;
    }

    if (entry.isFile() && entry.name === 'page.tsx') {
      files.push(fullPath);
    }
  }

  return files;
}

function isPublicPage(relativePath: string): boolean {
  return !EXCLUDED_PREFIXES.some(prefix => relativePath.startsWith(prefix));
}

function listPublicPageFiles(): string[] {
  if (!existsSync(APP_ROOT)) return [];

  return walkPageFiles(APP_ROOT)
    .map(path => relative(APP_ROOT, path).replace(/\\/g, '/'))
    .filter(isPublicPage);
}

describe('phase 13 ISR public route guard', () => {
  it('public pages do not import callServerApi or next/headers', () => {
    const violations: string[] = [];

    for (const pagePath of listPublicPageFiles()) {
      const source = readFileSync(join(APP_ROOT, pagePath), 'utf8');
      const usesPrivateServerApi =
        /import\s*\{[^}]*\bcallServerApi\b/.test(source) ||
        /import\s*\{[^}]*,\s*callServerApi\b/.test(source);
      const usesNextHeaders =
        /from\s+['"]next\/headers['"]/.test(source) ||
        /\bcookies\s*\(\s*\)/.test(source) ||
        /\bheaders\s*\(\s*\)/.test(source);

      if (usesPrivateServerApi || usesNextHeaders) {
        violations.push(pagePath);
      }
    }

    expect(violations).toEqual([]);
  });
});
