#!/usr/bin/env node
/**
 * Strips DashboardLayout wrapper from admin dashboard pages after layout extraction.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dashboardRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'app', 'admin', 'dashboard');
const notFoundPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'components',
  'section',
  'admin',
  'AdminDashboardNotFound.tsx'
);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (entry === 'page.tsx') files.push(full);
  }
  return files;
}

function stripDashboardLayout(source) {
  let next = source;

  next = next.replace(/^import \{ DashboardLayout \} from '@\/components\/layout\/DashboardLayout';\n/m, '');
  next = next.replace(
    /return \(\s*\n\s*<DashboardLayout>\s*\n([\s\S]*?)\s*<\/DashboardLayout>\s*\n\s*\);/m,
    'return (\n$1\n  );'
  );

  return next;
}

let count = 0;
for (const file of walk(dashboardRoot)) {
  const original = readFileSync(file, 'utf8');
  if (!original.includes('DashboardLayout')) continue;
  const updated = stripDashboardLayout(original);
  if (updated !== original) {
    writeFileSync(file, updated);
    count += 1;
    console.log('updated', file);
  }
}

const notFoundOriginal = readFileSync(notFoundPath, 'utf8');
if (notFoundOriginal.includes('DashboardLayout')) {
  writeFileSync(notFoundPath, stripDashboardLayout(notFoundOriginal));
  console.log('updated AdminDashboardNotFound');
  count += 1;
}

console.log(`Stripped DashboardLayout from ${count} files.`);
