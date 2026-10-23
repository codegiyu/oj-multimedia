import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const frontendRoot = path.resolve(__dirname, '../..');
const auditScript = path.join(frontendRoot, 'scripts/audit-endpoint-contract.mjs');

describe('endpoint contract audit (cross-repo)', () => {
  it('frontend catalog paths match backend route registrations', () => {
    const output = execFileSync(process.execPath, [auditScript], {
      cwd: frontendRoot,
      encoding: 'utf8',
    });

    expect(output).toContain('Endpoint contract audit passed.');
  });
});
