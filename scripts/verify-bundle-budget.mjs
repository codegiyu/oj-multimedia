import fs from 'node:fs';
import path from 'node:path';

const budgets = JSON.parse(fs.readFileSync('performance-budgets.json', 'utf8'));
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

if (total > budgets.maxTotalStaticJsBytes) {
  failures.push(
    `total static JS ${total} bytes exceeds budget ${budgets.maxTotalStaticJsBytes} bytes`
  );
}

if (largest > budgets.maxSingleChunkBytes) {
  failures.push(
    `largest chunk ${largestName} (${largest} bytes) exceeds budget ${budgets.maxSingleChunkBytes} bytes`
  );
}

if (failures.length > 0) {
  console.error('Bundle budget check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Bundle budgets OK (total=${total} bytes, largest=${largestName}:${largest} bytes)`
);
