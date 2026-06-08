import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Layout architecture contract', () => {
  it('keeps MainLayout as a server shell with client chrome islands', () => {
    const mainLayout = readFileSync(
      join(process.cwd(), 'components/layout/MainLayout.tsx'),
      'utf8'
    );
    const header = readFileSync(join(process.cwd(), 'components/layout/Header.tsx'), 'utf8');
    const footer = readFileSync(join(process.cwd(), 'components/layout/Footer.tsx'), 'utf8');

    expect(mainLayout).not.toContain("'use client'");
    expect(header).toContain("'use client'");
    expect(footer).toContain("'use client'");
    expect(mainLayout).toContain('<Header />');
    expect(mainLayout).toContain('<Footer />');
  });

  it('uses a server account layout with a client auth island', () => {
    const accountLayout = readFileSync(join(process.cwd(), 'app/account/layout.tsx'), 'utf8');
    const island = readFileSync(
      join(process.cwd(), 'components/layout/AccountAuthIsland.tsx'),
      'utf8'
    );

    expect(accountLayout).not.toContain("'use client'");
    expect(accountLayout).toContain('AccountAuthIsland');
    expect(island).toContain("'use client'");
    expect(island).toContain('AuthProtect');
  });
});
