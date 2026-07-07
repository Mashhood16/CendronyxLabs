/**
 * Merge theorem translations into the main translation JSON files.
 * Run: node scripts/merge-theorem-translations.mjs
 */
import { readFileSync, writeFileSync } from 'fs';

// Read generated theorem translations
const theoremEn = JSON.parse(readFileSync('src/locales/en/theorem-translations-v2.json', 'utf8'));

// Read existing English translation
const existingEn = JSON.parse(readFileSync('src/locales/en/translation.json', 'utf8'));

// Also read existing Roman Urdu translation
const existingRu = JSON.parse(readFileSync('src/locales/roman-urdu/translation.json', 'utf8'));

// Merge: existing keys take precedence for English (they're the same value anyway)
const mergedEn = { ...theoremEn, ...existingEn };
// Actually we want existing keys to override any generated ones (shouldn't be an issue but be safe)
// But actually we want ALL existing keys PLUS the new theorem keys
const mergedEnFinal = { ...existingEn, ...theoremEn };

writeFileSync('src/locales/en/translation.json', JSON.stringify(mergedEnFinal, null, 2), 'utf8');
console.log(`✓ Merged ${Object.keys(theoremEn).length} theorem entries into English translation.json`);

// For Roman Urdu: add theorem entries with English values as placeholders
// (existing Roman Urdu translations stay, new theorem entries get English as placeholder)
const mergedRu = { ...existingRu };
let addedCount = 0;
for (const [key, value] of Object.entries(theoremEn)) {
  if (!(key in existingRu)) {
    mergedRu[key] = value; // English text as placeholder for now
    addedCount++;
  }
}

writeFileSync('src/locales/roman-urdu/translation.json', JSON.stringify(mergedRu, null, 2), 'utf8');
console.log(`✓ Added ${addedCount} new theorem entries to Roman Urdu translation.json (with English placeholders)`);

// Count
const enCount = Object.keys(mergedEnFinal).length;
const ruCount = Object.keys(mergedRu).length;
console.log(`\nEnglish translation.json: ${enCount} keys`);
console.log(`Roman Urdu translation.json: ${ruCount} keys`);
console.log(`New theorem keys: ${Object.keys(theoremEn).length}`);
