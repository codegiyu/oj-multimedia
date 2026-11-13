import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

const FAILING_IMPACTS = new Set(['critical', 'serious']);

export type A11yScanOptions = {
  /** Human-readable route label for assertion messages. */
  context?: string;
  /**
   * axe rule ids to exclude (document each exclusion in tests/README or a ticket).
   * Example: ['color-contrast'] on pages with known brand palette debt.
   */
  disabledRules?: string[];
};

export async function expectNoCriticalA11yViolations(page: Page, options: A11yScanOptions = {}) {
  // Entrance animations (framer-motion fade-ins, up to ~1s) make axe measure color-contrast
  // against partially transparent elements, so let them finish before scanning.
  await page
    .waitForFunction(() => document.getAnimations().length === 0, undefined, {
      timeout: 5_000,
    })
    .catch(() => undefined);
  await page.waitForTimeout(1_500);

  const builder = new AxeBuilder({ page });

  if (options.disabledRules?.length) {
    builder.disableRules(options.disabledRules);
  }

  const results = await builder.analyze();
  const violations = results.violations.filter(v => FAILING_IMPACTS.has(v.impact ?? ''));

  if (violations.length > 0) {
    const summary = violations
      .map(v => `- ${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)`)
      .join('\n');
    const label = options.context ? ` on ${options.context}` : '';

    expect(violations, `A11y violations${label}:\n${summary}`).toHaveLength(0);
  }
}
