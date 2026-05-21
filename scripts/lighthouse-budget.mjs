import { spawnSync } from 'node:child_process';

const url = process.env.LIGHTHOUSE_URL;

if (!url) {
  console.log('Skipping Lighthouse budget check (set LIGHTHOUSE_URL to run, e.g. http://127.0.0.1:3000).');
  process.exit(0);
}

const result = spawnSync(
  'npx',
  [
    'lighthouse',
    url,
    '--quiet',
    '--chrome-flags=--headless',
    '--budget-path=lighthouse-budget.json',
    '--only-categories=performance',
  ],
  { stdio: 'inherit', shell: true }
);

process.exit(result.status ?? 1);
