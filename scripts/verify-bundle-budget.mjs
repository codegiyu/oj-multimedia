import fs from 'node:fs';
import path from 'node:path';

const budgets = JSON.parse(fs.readFileSync('performance-budgets.json', 'utf8'));
const smoke = budgets.smoke ?? budgets;
const chunksDir = path.join('.next', 'static', 'chunks');

if (!fs.existsSync(chunksDir)) {
  console.error(
    'Bundle budget check requires a production build (.next/static/chunks). Run `npm run build` first.'
  );
  process.exit(1);
}

let total = 0;
let largest = 0;
let largestName = '';

for (const file of fs.readdirSync(chunksDir)) {
  if (!file.endsWith('.js')) continue;
  const size = fs.statSync(path.join(chunksDir, file)).size;
  total += size;
  if (size > largest) {
    largest = size;
    largestName = file;
  }
}

const failures = [];

if (total > smoke.maxTotalStaticJsBytes) {
  failures.push(
    `total static JS ${total} bytes exceeds smoke budget ${smoke.maxTotalStaticJsBytes} bytes`
  );
}

if (largest > smoke.maxSingleChunkBytes) {
  failures.push(
    `largest chunk ${largestName} (${largest} bytes) exceeds smoke budget ${smoke.maxSingleChunkBytes} bytes`
  );
}

if (failures.length > 0) {
  console.error('Bundle budget check failed (smoke tier):');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

const lighthouseKb = budgets.lighthouse?.maxScriptTransferKb;
console.log(
  `Bundle smoke budgets OK (total=${total} bytes, largest=${largestName}:${largest} bytes)`
);

if (lighthouseKb) {
  console.log(
    `Lighthouse runtime script budget: ${lighthouseKb} KB (see ${budgets.lighthouse.budgetFile ?? 'lighthouse-budget.json'}; run with LIGHTHOUSE_URL)`
  );
}
