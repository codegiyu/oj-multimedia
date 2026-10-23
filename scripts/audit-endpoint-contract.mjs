import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(__dirname, '..');
const nestedBackendRoot = path.join(frontendRoot, 'oj-backend');
const backendRoot = fs.existsSync(nestedBackendRoot)
  ? nestedBackendRoot
  : path.resolve(frontendRoot, '..', 'oj-backend');

/** Maps route files to one or more URL prefixes (from app.ts registrations). */
const ROUTE_PREFIXES = [
  { file: 'auth.route.ts', prefixes: ['/api/v1/auth'] },
  { file: 'upload.route.ts', prefixes: ['/api/v1/upload', '/api/v1/admin/upload'] },
  { file: 'document.route.ts', prefixes: ['/api/v1/documents', '/api/v1/admin/documents'] },
  { file: 'emailLog.route.ts', prefixes: ['/api/v1/admin/email-logs'] },
  { file: 'contactSubmission.route.ts', prefixes: ['/api/v1/admin/contact-submissions'] },
  { file: 'notification.route.ts', prefixes: ['/api/v1/notifications'] },
  { file: 'siteSettings.route.ts', prefixes: ['/api/v1/site-settings', '/api/v1/admin/site-settings'] },
  { file: 'marketplace.route.ts', prefixes: ['/api/v1/marketplace'] },
  { file: 'user.route.ts', prefixes: ['/api/v1/user'] },
  { file: 'vendor.route.ts', prefixes: ['/api/v1/vendor'] },
  { file: 'artist.route.ts', prefixes: ['/api/v1/artist'] },
  { file: 'pastor.route.ts', prefixes: ['/api/v1/pastor'] },
  { file: 'public.route.ts', prefixes: ['/api/v1/public'] },
  { file: 'promotionAdmin.route.ts', prefixes: ['/api/v1/admin'] },
  { file: 'adminContent.route.ts', prefixes: ['/api/v1/admin'] },
  {
    file: 'adminContent/registerAdminMediaRoutes.ts',
    prefixes: ['/api/v1/admin'],
  },
  {
    file: 'adminContent/registerAdminMarketplaceRoutes.ts',
    prefixes: ['/api/v1/admin'],
  },
  { file: 'adminProfile.route.ts', prefixes: ['/api/v1/admin'] },
  { file: 'adminStaff.route.ts', prefixes: ['/api/v1/admin'] },
  { file: 'health.route.ts', prefixes: [''] },
];

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function extractFrontendPaths() {
  const endpointsDir = path.join(frontendRoot, 'lib/constants/endpoints');
  const paths = new Set();

  for (const file of fs.readdirSync(endpointsDir)) {
    if (!file.endsWith('.ts')) continue;
    const content = readFileSafe(path.join(endpointsDir, file));
    const matches = content.matchAll(/path:\s*['"](\/api\/v1[^'"]*)['"]/g);

    for (const match of matches) {
      paths.add(normalizePath(match[1]));
    }
  }

  return paths;
}

function extractRoutePathsFromContent(content) {
  const relativePaths = new Set();
  const matches = content.matchAll(
    /(?:app|[a-zA-Z]+App)\.(get|post|put|patch|delete)[\s\S]*?\(\s*['"]([^'"]+)['"]/g
  );

  for (const [, , routePath] of matches) {
    relativePaths.add(routePath);
  }

  return relativePaths;
}

function extractBackendPaths() {
  const paths = new Set();
  const routesDir = path.join(backendRoot, 'src/routes');

  for (const { file, prefixes } of ROUTE_PREFIXES) {
    const content = readFileSafe(path.join(routesDir, file));
    const relativePaths = extractRoutePathsFromContent(content);

    for (const prefix of prefixes) {
      for (const routePath of relativePaths) {
        const suffix = routePath === '/' ? '' : routePath.startsWith('/') ? routePath : `/${routePath}`;
        paths.add(normalizePath(`${prefix}${suffix}`));
      }
    }
  }

  paths.add('/health');
  paths.add('/ready');

  return paths;
}

function normalizePath(p) {
  return p.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
}

function pathMatchesCatalog(catalogPath, backendPath) {
  if (catalogPath === backendPath) return true;

  const catalogSegments = catalogPath.split('/').filter(Boolean);
  const backendSegments = backendPath.split('/').filter(Boolean);

  if (catalogSegments.length > backendSegments.length) return false;

  for (let i = 0; i < catalogSegments.length; i++) {
    const catalogSeg = catalogSegments[i];
    const backendSeg = backendSegments[i];

    if (catalogSeg === backendSeg) continue;
    if (backendSeg.startsWith(':')) continue;
    return false;
  }

  return true;
}

function main() {
  const frontendPaths = extractFrontendPaths();
  const backendPaths = extractBackendPaths();

  const missingOnBackend = [];
  for (const fePath of [...frontendPaths].sort()) {
    const hasMatch = [...backendPaths].some(be => pathMatchesCatalog(fePath, be));
    if (!hasMatch) missingOnBackend.push(fePath);
  }

  const missingOnFrontend = [];
  for (const bePath of [...backendPaths].sort()) {
    if (bePath === '/health' || bePath === '/ready') continue;
    const hasMatch = [...frontendPaths].some(fe => pathMatchesCatalog(fe, bePath));
    if (!hasMatch) missingOnFrontend.push(bePath);
  }

  console.log(`Frontend catalog paths: ${frontendPaths.size}`);
  console.log(`Backend registered paths: ${backendPaths.size}`);

  if (missingOnBackend.length) {
    console.error('\nCatalog paths with no backend route match:');
    for (const p of missingOnBackend) console.error(`  - ${p}`);
  }

  if (missingOnFrontend.length) {
    console.warn('\nBackend paths not in frontend catalog (informational):');
    for (const p of missingOnFrontend.slice(0, 15)) console.warn(`  - ${p}`);
    if (missingOnFrontend.length > 15) {
      console.warn(`  ... and ${missingOnFrontend.length - 15} more`);
    }
  }

  if (missingOnBackend.length > 0) {
    process.exit(1);
  }

  console.log('\nEndpoint contract audit passed.');
}

main();
