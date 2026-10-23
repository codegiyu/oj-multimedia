import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { isClientErrorReportingEnabled } from '../../../lib/observability/clientErrorReporting';
import { isWebVitalsReportingEnabled } from '../../../lib/observability/webVitals';

describe('Phase 9 contract (observability completion)', () => {
  it('gates optional client monitoring env flags', () => {
    expect(isWebVitalsReportingEnabled('1')).toBe(true);
    expect(isClientErrorReportingEnabled('')).toBe(false);
  });

  it('ships frontend observability documentation', () => {
    const doc = readFileSync(join(process.cwd(), 'docs', 'OBSERVABILITY.md'), 'utf8');

    expect(doc).toContain('NEXT_PUBLIC_ENABLE_WEB_VITALS');
    expect(doc).toContain('NEXT_PUBLIC_SENTRY_DSN');
  });
});
