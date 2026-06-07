#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dashboardRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'app', 'admin', 'dashboard');

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (entry === 'page.tsx' || entry === 'loading.tsx') files.push(full);
  }
  return files;
}

const importLine = "import { PageHeader } from '@/components/general/PageHeader';\r\n";
let count = 0;

for (const file of walk(dashboardRoot)) {
  const source = readFileSync(file, 'utf8');
  if (!source.includes('<PageHeader')) continue;
  if (source.includes("from '@/components/general/PageHeader'")) continue;

  const updated = importLine + source;
  writeFileSync(file, updated);
  count += 1;
  console.log('added import to', file);
}

console.log(`Added PageHeader import to ${count} files.`);
