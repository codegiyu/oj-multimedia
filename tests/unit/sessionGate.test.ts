import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('SessionGate architecture', () => {
  it('centralizes session init in SessionGate and keeps thin wrappers', () => {
    const gate = readFileSync(join(process.cwd(), 'components/auth/SessionGate.tsx'), 'utf8');
    const authProtect = readFileSync(join(process.cwd(), 'components/AuthProtect.tsx'), 'utf8');
    const adminWrapper = readFileSync(
      join(process.cwd(), 'components/layout/AdminAuthWrapper.tsx'),
      'utf8'
    );

    expect(gate).toContain('initSession');
    expect(gate).toContain('sessionInitializedRef');
    expect(authProtect).toContain('SessionGate');
    expect(authProtect).not.toContain('initSession');
    expect(adminWrapper).toContain('SessionGate');
    expect(adminWrapper).not.toContain('initSession');
    expect(adminWrapper).toContain('unprotectedRoutes');
  });
});
