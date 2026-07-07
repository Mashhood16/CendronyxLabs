// scripts/fix-all-corrupted.mjs
// Finds ALL RU values containing non-Latin script characters and restores them to English
import fs from 'fs';

const ruPath = 'src/locales/roman-urdu/translation.json';
const enPath = 'src/locales/en/translation.json';

const ru = JSON.parse(fs.readFileSync(ruPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// These are valid Roman Urdu and English characters + common symbols
// Latin letters, digits, punctuation, math symbols, currency, spaces
const VALID_REGEX = /^[\u0000-\u007F\u00C0-\u024F\u1E00-\u1EFF\u2000-\u206F\u20A0-\u20CF\u2100-\u214F\u2150-\u218F\u2190-\u21FF\u2200-\u22FF\u2300-\u23FF\u25A0-\u25FF\u2600-\u26FF\u2700-\u27BF\u27C0-\u27EF\u27F0-\u27FF\u2800-\u28FF\u2900-\u297F\u2980-\u29FF\u2A00-\u2AFF\u2B00-\u2BFF]*$/;

// Characters NOT allowed in Roman Urdu output:
// Arabic (including remaining Nastaliq): \u0600-\u06FF \u0750-\u077F \u08A0-\u08FF \uFB50-\uFDFF \uFE70-\uFEFF
// CJK: \u3040-\u309F \u30A0-\u30FF \u4E00-\u9FFF \u3400-\u4DBF \uFF00-\uFFEF
// Cyrillic: \u0400-\u04FF \u0500-\u052F
// Devanagari: \u0900-\u097F
// Bengali: \u0980-\u09FF
// Gurmukhi: \u0A00-\u0A7F
// Gujarati: \u0A80-\u0AFF
// Tamil: \u0B80-\u0BFF
// Telugu: \u0C00-\u0C7F
// Kannada: \u0C80-\u0CFF
// Malayalam: \u0D00-\u0D7F
// Thai: \u0E00-\u0E7F
// Lao: \u0E80-\u0EFF
// Tibetan: \u0F00-\u0FFF
// Georgian: \u10A0-\u10FF
// Hangul: \uAC00-\uD7AF
// Bopomofo: \u3100-\u312F
// Yi: \uA000-\uA4CF
// etc.

function hasNonLatinScript(str) {
  if (!str || typeof str !== 'string') return false;
  
  // Check for characters from non-Latin scripts
  // Range covering Arabic, CJK, Cyrillic, Devanagari, Bengali, etc.
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // Arabic
    if ((code >= 0x0600 && code <= 0x06FF) ||
        (code >= 0x0750 && code <= 0x077F) ||
        (code >= 0x08A0 && code <= 0x08FF) ||
        (code >= 0xFB50 && code <= 0xFDFF) ||
        (code >= 0xFE70 && code <= 0xFEFF) ||
        // CJK
        (code >= 0x3040 && code <= 0x309F) ||
        (code >= 0x30A0 && code <= 0x30FF) ||
        (code >= 0x4E00 && code <= 0x9FFF) ||
        (code >= 0xFF00 && code <= 0xFFEF) ||
        // Cyrillic
        (code >= 0x0400 && code <= 0x052F) ||
        // Devanagari
        (code >= 0x0900 && code <= 0x097F) ||
        // Bengali
        (code >= 0x0980 && code <= 0x09FF) ||
        // Gurmukhi
        (code >= 0x0A00 && code <= 0x0A7F) ||
        // Gujarati
        (code >= 0x0A80 && code <= 0x0AFF) ||
        // Tamil
        (code >= 0x0B80 && code <= 0x0BFF) ||
        // Telugu
        (code >= 0x0C00 && code <= 0x0C7F) ||
        // Kannada
        (code >= 0x0C80 && code <= 0x0CFF) ||
        // Malayalam
        (code >= 0x0D00 && code <= 0x0D7F) ||
        // Thai
        (code >= 0x0E00 && code <= 0x0E7F) ||
        // Hangul
        (code >= 0xAC00 && code <= 0xD7AF) ||
        // Georgian
        (code >= 0x10A0 && code <= 0x10FF)) {
      return true;
    }
  }
  return false;
}

let fixedCount = 0;
let skippedMissing = 0;
let unchangedCount = 0;
const fixedKeys = [];
const seenCorrupted = [];

Object.keys(ru).forEach(k => {
  const ruVal = ru[k];
  if (!ruVal || typeof ruVal !== 'string') return;
  
  // If it has non-Latin script characters, fix it
  if (hasNonLatinScript(ruVal)) {
    const enVal = en[k];
    if (enVal && typeof enVal === 'string') {
      // Skip if already same (shouldn't happen but just in case)
      if (ruVal === enVal) {
        unchangedCount++;
        return;
      }
      ru[k] = enVal;
      fixedCount++;
      fixedKeys.push({ key: k, from: ruVal.substring(0, 50), to: enVal.substring(0, 50) });
    } else {
      skippedMissing++;
      seenCorrupted.push({ key: k, val: ruVal.substring(0, 50) });
    }
  }
});

console.log('=== FIX ALL CORRUPTED VALUES ===');
console.log('Fixed:', fixedCount, 'values restored to English');
console.log('Skipped (no EN key):', skippedMissing);
console.log('Unchanged (already same):', unchangedCount);
console.log('');

if (fixedKeys.length > 0) {
  console.log('=== FIXED KEYS (first 50) ===');
  fixedKeys.slice(0, 50).forEach(f => console.log(f.key.substring(0, 55) + ': ' + f.from + ' → ' + f.to));
  if (fixedKeys.length > 50) console.log('... and ' + (fixedKeys.length - 50) + ' more');
}

if (seenCorrupted.length > 0) {
  console.log('');
  console.log('=== KEYS WITH NO EN FALLBACK ===');
  seenCorrupted.forEach(c => console.log(c.key.substring(0, 55) + ': ' + c.val));
}

fs.writeFileSync(ruPath, JSON.stringify(ru, null, 2));
console.log('\nFile saved.');
