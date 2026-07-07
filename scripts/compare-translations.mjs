import { readFileSync } from 'fs';

const en = JSON.parse(readFileSync('./src/locales/en/translation.json', 'utf8'));
const ru = JSON.parse(readFileSync('./src/locales/roman-urdu/translation.json', 'utf8'));

const enKeys = Object.keys(en).sort();
const ruKeys = Object.keys(ru).sort();

const missing = enKeys.filter(k => !ruKeys.includes(k));
const common = enKeys.filter(k => ruKeys.includes(k));
const extraInRu = ruKeys.filter(k => !enKeys.includes(k));

console.log('=== Translation Key Comparison ===');
console.log('English keys:', enKeys.length);
console.log('Roman Urdu keys:', ruKeys.length);
console.log('Common keys:', common.length);
console.log('Missing from RU (need translation):', missing.length);
console.log('Extra in RU (not in EN):', extraInRu.length);

if (missing.length > 0) {
  console.log('\n=== First 50 Missing Keys (need translation) ===');
  console.log(JSON.stringify(missing.slice(0, 50), null, 2));
}

if (extraInRu.length > 0) {
  console.log('\n=== First 20 Extra Keys in RU (not in EN) ===');
  console.log(JSON.stringify(extraInRu.slice(0, 20), null, 2));
}

// Check a few existing RU translations to see if they look translated
console.log('\n=== Sample of existing RU translations ===');
const sampleKeys = common.slice(0, 10);
for (const key of sampleKeys) {
  console.log(`\n${key}:`);
  console.log(`  EN: ${en[key].substring(0, 80)}`);
  console.log(`  RU: ${ru[key].substring(0, 80)}`);
}
