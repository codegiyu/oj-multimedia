#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dashboardRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'app', 'admin', 'dashboard');

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (entry === 'page.tsx') files.push(full);
  }
  return files;
}

let count = 0;
for (const file of walk(dashboardRoot)) {
  const source = readFileSync(file, 'utf8');
  if (!source.includes("import { DashboardLayout }")) continue;
  if (source.includes('<DashboardLayout')) continue;

  const updated = source.replace(
    /^import \{ DashboardLayout \} from '@\/components\/layout\/DashboardLayout';\r?\n/m,
    ''
  );

  if (updated !== source) {
    writeFileSync(file, updated);
    count += 1;
    console.log('removed import from', file);
  }
}

console.log(`Removed unused DashboardLayout imports from ${count} files.`);
