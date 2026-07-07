// Usage: node scripts/merge-translations.mjs <batch-file>
// batch-file: JSON with { "key1": "translation1", "key2": "translation2", ... }
import { readFileSync, writeFileSync, existsSync } from 'fs';

const batchFile = process.argv[2];
if (!batchFile) {
  console.error('Usage: node scripts/merge-translations.mjs <batch-file>');
  process.exit(1);
}

const RU = './src/locales/roman-urdu/translation.json';
const batch = JSON.parse(readFileSync(batchFile, 'utf8'));
const batchKeys = Object.keys(batch);
console.log(`Batch has ${batchKeys.length} keys`);

let ru = {};
if (existsSync(RU)) {
  try { ru = JSON.parse(readFileSync(RU, 'utf8')); } catch(e) { ru = {}; }
}

let added = 0, skipped = 0;
for (const k of batchKeys) {
  if (ru[k] === undefined) {
    ru[k] = batch[k];
    added++;
  } else {
    skipped++;
  }
}

const sorted = Object.keys(ru).sort();
const obj = {};
for (const k of sorted) obj[k] = ru[k];
writeFileSync(RU, JSON.stringify(obj, null, 2), 'utf8');
console.log(`Added: ${added}, Skipped (already exist): ${skipped}, Total RU keys: ${Object.keys(ru).length}`);
