import fs from 'fs';

const EN_FILE = 'src/locales/en/translation.json';
const RU_FILE = 'src/locales/roman-urdu/translation.json';

const en = JSON.parse(fs.readFileSync(EN_FILE, 'utf8'));
const ru = JSON.parse(fs.readFileSync(RU_FILE, 'utf8'));

// === FIX 1: Restore sidebar nav keys to English ===
// The user wants sidebar components to stay in English
const sidebarKeys = [
  'nav.modules', 'nav.home', 'nav.history', 'nav.settings', 'nav.search',
  'status.online', 'status.offline', 'status.available_count', 'status.available_to_play'
];

console.log('=== Fix 1: Restoring sidebar keys to English ===');
sidebarKeys.forEach(k => {
  if (en[k] && ru[k] !== en[k]) {
    console.log(`  ${k}: "${ru[k]}" → "${en[k]}"`);
    ru[k] = en[k];
  }
});

// === FIX 2: Fix class.platform_name ===
console.log('\n=== Fix 2: Fixing platform_name ===');
ru['class.platform_name'] = 'Cendronyx Labs';
console.log('  class.platform_name fixed');

// === FIX 3: Detect and fix garbled Nastaliq conversion artifacts ===
// These are values where the character-level transliteration produced unreadable output.
// We restore them to their English source values.
console.log('\n=== Fix 3: Fixing garbled values ===');

// Known garbled patterns from the Nastaliq char conversion
const GARBLED_PATTERNS = [
  'shMal', 'jnaub', 'mnslk', 'mqnatysy', 'mqnatys', 'mydin', 'mydun',
  'zaoyeh', 'aynglz', 'aydjs', 'inhraPer', 'AqrAb', 'wkyw', 'dwry',
  'ASTA', 'SYD', 'nzry', 'pej', 'mZbOoT', 'Kmy', 'Awwl', 'Akhri',
  'Tlsh', 'AjIb', 'dykhl', 'bhrin', 'hsab', 'shdh', 'rykard',
  'lyzr', 'klk', 'mshrq', 'mghrb',
];

const garbledKeys = [];
Object.keys(ru).forEach(k => {
  const v = ru[k];
  if (!v) return;
  for (const pat of GARBLED_PATTERNS) {
    if (v.includes(pat)) {
      garbledKeys.push(k);
      break;
    }
  }
});

console.log(`Found ${garbledKeys.length} keys with garbled patterns`);
let fixed = 0;
garbledKeys.forEach(k => {
  if (en[k] && ru[k] !== en[k]) {
    console.log(`  ${k.substring(0, 50)}: "${ru[k].substring(0, 60)}..." → EN value`);
    ru[k] = en[k];
    fixed++;
  }
});
console.log(`Fixed ${fixed} garbled values (restored to English)`);

// Write
fs.writeFileSync(RU_FILE, JSON.stringify(ru, null, 2));
console.log('\nFile written successfully');

// Verify
const finalDiff = Object.keys(en).filter(k => ru[k] && ru[k] !== en[k]);
console.log(`\nTotal translated (differs from EN): ${finalDiff.length}`);
