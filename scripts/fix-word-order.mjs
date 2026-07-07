// scripts/fix-word-order.mjs
// Restores word-replaced translations (English word order with Urdu particles)
// back to clean English. Keeps only proper Roman Urdu translations.
import fs from 'fs';

const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));
const ru = JSON.parse(fs.readFileSync('src/locales/roman-urdu/translation.json', 'utf8'));

// Urdu particles that word-replacement adds into English sentences
const URDU_PARTICLES = new Set([
  'ka', 'ke', 'ki', 'ko', 'se', 'mein', 'aur', 'hai', 'hain', 'nahi',
  'ya', 'na', 'neeche', 'upar', 'bheetar', 'bahar', 'pe', 'par',
  'liye', 'saath', 'zariye', 'baad', 'pehle', 'darmiyan',
  'kar', 'karna', 'karte', 'karta', 'karein', 'kiya', 'karo',
  'ho', 'hota', 'hote', 'hoti', 'hain', 'thi', 'tha', 'the',
  'is', 'us', 'ye', 'woh'
]);

function isWordReplacement(enText, ruText) {
  if (!enText || !ruText || enText.length < 10) return false;
  
  const enWords = enText.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const ruWords = ruText.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  if (ruWords.length === 0) return false;
  
  // Count English content words that appear verbatim in RU
  let englishWordsInRU = 0;
  for (const rw of ruWords) {
    if (URDU_PARTICLES.has(rw)) continue; // skip Urdu particles
    if (enWords.includes(rw)) englishWordsInRU++;
  }
  
  const totalContentWords = ruWords.filter(w => !URDU_PARTICLES.has(w)).length;
  if (totalContentWords === 0) return false;
  
  const ratio = englishWordsInRU / totalContentWords;
  
  // If >45% of RU content words are just English words copied verbatim,
  // this is a word-replacement translation, not proper Roman Urdu
  return ratio > 0.45;
}

let fixedCount = 0;
let keptCount = 0;
const examples = [];

Object.keys(en).forEach(k => {
  const ev = en[k];
  const rv = ru[k];
  if (!ev || !rv || rv === ev) return;
  
  if (isWordReplacement(ev, rv)) {
    examples.push({ key: k, en: ev.substring(0, 50), ru: rv.substring(0, 50) });
    ru[k] = ev; // restore to clean English
    fixedCount++;
  } else {
    keptCount++;
  }
});

console.log(`=== WORD-ORDER FIX RESULTS ===`);
console.log(`Fixed (restored to English): ${fixedCount}`);
console.log(`Kept as Roman Urdu: ${keptCount}`);
console.log('');

if (examples.length > 0) {
  console.log('=== EXAMPLES OF FIXED TRANSLATIONS ===');
  examples.slice(0, 30).forEach(ex => {
    console.log(ex.key.substring(0, 50));
    console.log('  EN: ' + ex.en);
    console.log('  OLD RU: ' + ex.ru);
    console.log('');
  });
  if (examples.length > 30) {
    console.log(`... and ${examples.length - 30} more`);
  }
}

if (fixedCount > 0) {
  const sorted = Object.keys(ru).sort();
  const obj = {};
  for (const k of sorted) obj[k] = ru[k];
  fs.writeFileSync('src/locales/roman-urdu/translation.json', JSON.stringify(obj, null, 2));
  console.log('File saved.');
  
  // Count final stats
  const diffCount = Object.keys(en).filter(k => en[k] && ru[k] && ru[k] !== en[k]).length;
  console.log(`\nTotal keys different from EN: ${diffCount}`);
}
