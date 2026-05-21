/**
 * One-off splitter: generates lib/constants/endpoints/*.ts from endpoints.ts
 * Run: node scripts/split-endpoints.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.join(process.cwd(), 'lib/constants');
const src = fs.readFileSync(path.join(root, 'endpoints.ts'), 'utf8');

const endpointsStart = src.indexOf('export const ENDPOINTS');
const endpointsEnd = src.indexOf('};', endpointsStart) + 2;
const beforeEndpoints = src.slice(0, endpointsStart);
const endpointsBlock = src.slice(endpointsStart, endpointsEnd);
const afterEndpoints = src.slice(endpointsEnd);

const body = endpointsBlock.replace(/^export const ENDPOINTS[^=]*=\s*\{/, '').replace(/\};\s*$/, '');

const sections = {
  auth: [],
  admin: [],
  public: [],
  other: [],
};

let current = 'other';
for (const line of body.split('\n')) {
  if (/^\s*\/\/ Authentication/.test(line)) current = 'auth';
  else if (/^\s*\/\/ (Admin|Documents \(Admin\)|Email logs \(Admin\)|Contact submissions \(Admin\))/.test(line))
    current = 'admin';
  else if (/^\s*\/\/ (Public|Marketplace \(public\)|Promotion content \(public\)|Contact & Search \(public\))/.test(line))
    current = 'public';
  else if (/^\s*\/\/ (Artist dashboard|Vendor dashboard)/.test(line)) current = 'other';
  else if (/^\s*ADMIN_/.test(line)) current = 'admin';
  else if (/^\s*PUBLIC_/.test(line)) current = 'public';
  else if (/^\s*AUTH_/.test(line)) current = 'auth';

  sections[current].push(line);
}

const outDir = path.join(root, 'endpoints');
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, 'types.ts'),
  `${beforeEndpoints.trim()}\n`
);

const catalogHeader = `import type { EndpointDetails } from './types';\n\nexport const `;

for (const [name, lines] of Object.entries(sections)) {
  if (lines.length === 0) continue;
  const constName =
    name === 'auth'
      ? 'AUTH_USER_ENDPOINTS'
      : name === 'admin'
        ? 'ADMIN_ENDPOINTS'
        : name === 'public'
          ? 'PUBLIC_ENDPOINTS'
          : 'OTHER_ENDPOINTS';
  fs.writeFileSync(
    path.join(outDir, `${name}.ts`),
    `${catalogHeader}${constName}: Record<string, EndpointDetails> = {\n${lines.join('\n')}\n};\n`
  );
}

fs.writeFileSync(path.join(outDir, 'post.ts'), afterEndpoints.trim() + '\n');

const index = `/* eslint-disable @typescript-eslint/no-explicit-any */
export * from './types';
export * from './post';
export { AUTH_USER_ENDPOINTS } from './auth';
export { ADMIN_ENDPOINTS } from './admin';
export { PUBLIC_ENDPOINTS } from './public';
export { OTHER_ENDPOINTS } from './other';

import type { AllEndpoints } from './types';
import type { EndpointDetails } from './types';
import { AUTH_USER_ENDPOINTS } from './auth';
import { ADMIN_ENDPOINTS } from './admin';
import { PUBLIC_ENDPOINTS } from './public';
import { OTHER_ENDPOINTS } from './other';

/** Backend REST prefix; every catalog path includes this segment. */
export { API_V1_PREFIX } from './types';

export const ENDPOINTS = {
  ...AUTH_USER_ENDPOINTS,
  ...ADMIN_ENDPOINTS,
  ...OTHER_ENDPOINTS,
  ...PUBLIC_ENDPOINTS,
} as Record<keyof AllEndpoints, EndpointDetails>;
`;

fs.writeFileSync(path.join(outDir, 'index.ts'), index);

fs.writeFileSync(
  path.join(root, 'endpoints.ts'),
  `/** @deprecated Import from '@/lib/constants/endpoints' barrel (./endpoints/index.ts). */\nexport * from './endpoints/index';\n`
);

console.log('Split complete:', outDir);
