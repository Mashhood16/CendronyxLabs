// Usage: node scripts/extract-batch.mjs <start-index> [batch-size]
// Outputs: scripts/batch-<index>.json with { "key": "english value", ... }
import { readFileSync, writeFileSync, existsSync } from 'fs';

const start = parseInt(process.argv[2] || '0');
const batchSize = parseInt(process.argv[3] || '300');

const EN = './src/locales/en/translation.json';
const RU = './src/locales/roman-urdu/translation.json';

const en = JSON.parse(readFileSync(EN, 'utf8'));
const enKeys = Object.keys(en);

let ru = {};
if (existsSync(RU)) {
  try { ru = JSON.parse(readFileSync(RU, 'utf8')); } catch(e) {}
}

// Get untranslated keys
const untranslated = enKeys.filter(k => ru[k] === undefined);
console.log(`Total untranslated: ${untranslated.length}`);

const batchKeys = untranslated.slice(start, start + batchSize);
const batch = {};
for (const k of batchKeys) {
  batch[k] = en[k];
}

const outPath = `scripts/batch-${start}.json`;
writeFileSync(outPath, JSON.stringify(batch, null, 2), 'utf8');
console.log(`Wrote ${Object.keys(batch).length} keys to ${outPath}`);
console.log(`Range: ${start} to ${start + batchKeys.length - 1}`);
console.log(`First key: ${batchKeys[0] || 'none'}`);
console.log(`Last key: ${batchKeys[batchKeys.length - 1] || 'none'}`);
