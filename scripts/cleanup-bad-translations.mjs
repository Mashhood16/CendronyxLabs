// scripts/cleanup-bad-translations.mjs
// Detects and restores bad-quality Groq translations to English
import fs from 'fs';

const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));
const ru = JSON.parse(fs.readFileSync('src/locales/roman-urdu/translation.json', 'utf8'));

// Nonsense word patterns from failed Groq translations
const BAD_PATTERNS = [
  /\blche\b/i, /\bmsth\b/i, /\bdlchshh\b/i, /\bistyld\b/i, /\bhodr\b/i,
  /\bthol\b/i, /\bparist\b/i, /\bdrjzelf\b/i, /\bmqadyr\b/i, /\brt\s+ko\s+kam\b/i,
  /isla\s+lche/i, /sr\s+o\s+mqadyr/i, /parist\s+Mart/i,
  // 7+ consecutive consonants (no vowels) - unlikely in Roman Urdu
  /[bcdfghjklmnpqrstvwxz]{7,}/i,
];

// Fix specific known-bad keys directly
const KNOWN_BAD = {
  'lab.c10dilutesolution_theory': 'Theory',
  'lab.c10dilutesolution_theory_setup': 'Theory & Setup',
  'lab.c10dilutesolution_dilution_equation': 'Dilution Equation',
  'lab.c10dilutesolution_initial_molarity_stock': '= Initial Molarity (Stock)',
  'lab.c10dilutesolution_volume_of_stock_added': '= Volume of Stock added',
  'lab.c10dilutesolution_distilled_h_o': 'Distilled H\u2082O',
  'lab.c10dilutesolution_to_dilute_the_solution': 'to dilute the solution.',
  'lab.c10dilutesolution_volume_stock_ml': 'Volume Stock (mL)',
};

let fixed = 0;

// Fix known bad keys
Object.entries(KNOWN_BAD).forEach(([key, enVal]) => {
  if (ru[key] && ru[key] !== enVal) {
    console.log('FIX (known): ' + key.substring(0, 50) + ': "' + ru[key].substring(0, 40) + '" -> "' + enVal.substring(0, 40) + '"');
    ru[key] = enVal;
    fixed++;
  }
});

// Detect pattern-based bad translations
Object.keys(en).forEach(k => {
  const ev = en[k];
  const rv = ru[k];
  if (!ev || !rv || rv === ev) return;
  if (KNOWN_BAD[k]) return; // already fixed above

  let isBad = false;
  for (const pattern of BAD_PATTERNS) {
    if (pattern.test(rv)) {
      isBad = true;
      break;
    }
  }

  if (isBad) {
    console.log('FIX (pattern): ' + k.substring(0, 50) + ': "' + rv.substring(0, 50) + '" -> "' + ev.substring(0, 50) + '"');
    ru[k] = ev;
    fixed++;
  }
});

console.log('\nTotal fixed: ' + fixed + ' bad translations restored to English');

if (fixed > 0) {
  const sorted = Object.keys(ru).sort();
  const obj = {};
  for (const k of sorted) obj[k] = ru[k];
  fs.writeFileSync('src/locales/roman-urdu/translation.json', JSON.stringify(obj, null, 2));
  console.log('File saved.');
}
