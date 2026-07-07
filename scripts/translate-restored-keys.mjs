// scripts/translate-restored-keys.mjs
// Translates the restored English keys back to proper Roman Urdu using Groq API
import { readFileSync, writeFileSync } from 'fs';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) { console.error('No GROQ_API_KEY'); process.exit(1); }

const EN = './src/locales/en/translation.json';
const RU = './src/locales/roman-urdu/translation.json';
const PROTECTED = './scripts/protected-words.json';

const en = JSON.parse(readFileSync(EN, 'utf8'));
const ru = JSON.parse(readFileSync(RU, 'utf8'));
const protectedWords = JSON.parse(readFileSync(PROTECTED, 'utf8'));

// Keys that should stay English (sidebar nav, platform, etc.)
const KEEP_ENGLISH = new Set([
  'nav.modules', 'nav.home', 'nav.history', 'nav.settings', 'nav.search',
  'status.online', 'status.offline', 'status.available_count', 'status.available_to_play',
  'class.platform_name', 'class.platform_tagline',
]);

// Find keys that were restored to English (backup === EN) and are meaningful strings to translate
const restoredKeys = [];
Object.keys(en).forEach(k => {
  if (KEEP_ENGLISH.has(k)) return;
  if (k.startsWith('lab.verb.')) return;
  
  const ev = en[k];
  const rv = ru[k];
  if (!ev || !rv) return;
  
  // Keys where RU still equals EN (were restored and not word-replaced)
  // AND have meaningful text worth translating (>= 8 chars, natural language)
  if (rv === ev && ev.length >= 8 && 
      !/^[A-Z][a-z]+$/.test(ev.trim()) && // Single capitalized word like "Simulator" - fine in English
      !/^[\d\s(){}\[\]{}|:;,.%°^=+\-*/<>\w.]+$/.test(ev) // Formula-only
     ) {
    // Skip pure UI labels that are fine in English
    const skipPatterns = [
      /^(Step \d+|Score|Input|Output|Setup|Controls|Data|Analysis|Theory|Lab|Procedure)$/i,
      /^\w+ \(\w+\)$/, // "Current (A)", "Voltage (V)"
      /^\w+ \w+ \w+$/, // "Interactive Simulator" 
    ];
    const shouldSkip = skipPatterns.some(p => p.test(ev.trim()));
    if (!shouldSkip || ev.length > 25) {
      restoredKeys.push({ key: k, text: ev });
    }
  }
});

// Also include the 123 word-replaced keys for cleaner translations
// (they currently have word-replaced RU like "ka", "aur" mixed in)
Object.keys(en).forEach(k => {
  if (KEEP_ENGLISH.has(k)) return;
  if (k.startsWith('lab.verb.')) return;
  
  const ev = en[k];
  const rv = ru[k];
  if (!ev || !rv) return;
  
  // Keys where RU !== EN but were restored (word-replaced version of English)
  // Check if the key is already in restoredKeys
  if (rv !== ev && ev.length >= 8) {
    const alreadyAdded = restoredKeys.some(r => r.key === k);
    if (!alreadyAdded) {
      // Check if this looks word-replaced (contains Roman Urdu particles but is mostly English)
      const ruWords = rv.split(/\s+/);
      const enWords = ev.split(/\s+/);
      // If it has placeholders like {vars} or formulas, skip
      if (!/[=+\-*/^]/.test(ev) || ev.length > 30) {
        restoredKeys.push({ key: k, text: ev });
      }
    }
  }
});

console.log(`Total keys to translate: ${restoredKeys.length}`);

// Write the list to a JSON file for reference
writeFileSync('scripts/restored-keys-list.json', JSON.stringify(restoredKeys, null, 2));
console.log('Saved list to scripts/restored-keys-list.json');

// Batch translation
const BATCH_SIZE = 30;
function chunk(a, s) { const c=[]; for(let i=0; i<a.length; i+=s) c.push(a.slice(i,i+s)); return c; }
const batches = chunk(restoredKeys, BATCH_SIZE);
console.log(`Batches: ${batches.length}`);

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function translateBatch(entries) {
  // Add protected words to the system prompt
  const protectedStr = protectedWords.join(', ');
  
  // Create numbered list
  const text = entries.map((e, i) => `[${i}] ${e.text}`).join('\n');
  
  const systemPrompt = `You are a Roman Urdu (Urdu written in Latin script) translator for educational science content. 
Translate each English text to natural Roman Urdu.

CRITICAL RULES:
- NEVER translate these protected words (keep EXACTLY as-is): ${protectedStr}
- Keep ALL {variables}, numbers, units (m, s, kg, A, V, Ω, N, J, W, Pa, Hz, C, K, mol, cd), mathematical formulas, and equations EXACTLY as-is
- Keep all HTML entities, emojis, $LaTeX$, and [brackets] EXACTLY as-is
- Roman Urdu uses Latin alphabet, not Arabic script
- Output ONLY a valid JSON array of strings, one per input line
- Do NOT add numbering or prefixes to the output strings`;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Translate each of these ${entries.length} texts to natural Roman Urdu. Return ONLY a valid JSON array:\n\n${text}` }
          ],
          temperature: 0.1,
          max_tokens: 4096,
        })
      });
      
      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 429) {
          const wait = Math.min(60000, 5000 * Math.pow(2, attempt));
          console.log(`  ⏳ Rate limited (429), waiting ${wait/1000}s...`);
          await sleep(wait);
          continue;
        }
        console.log(`  ⚠️ HTTP ${res.status}: ${errText.substring(0, 100)}`);
        await sleep(10000);
        continue;
      }
      
      const data = await res.json();
      let content = data.choices[0].message.content.trim();
      
      // Clean markdown code fences
      if (content.startsWith('```json')) content = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      else if (content.startsWith('```')) content = content.replace(/^```\n?/, '').replace(/\n?```$/, '');
      
      // Extract JSON array
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) content = jsonMatch[0];
      
      const translations = JSON.parse(content);
      if (!Array.isArray(translations)) throw new Error('Not an array');
      if (translations.length !== entries.length)
        throw new Error(`Expected ${entries.length}, got ${translations.length}`);
      
      return translations;
    } catch(e) {
      console.error(`  ❌ Attempt ${attempt+1}: ${e.message.substring(0, 100)}`);
      await sleep(5000 * (attempt + 1));
    }
  }
  throw new Error('All attempts failed');
}

async function main() {
  let totalTranslated = 0;
  let consecutiveErrors = 0;
  
  for (let b = 0; b < batches.length; b++) {
    const entries = batches[b];
    const startIdx = b * BATCH_SIZE + 1;
    const endIdx = b * BATCH_SIZE + entries.length;
    console.log(`\n[${b+1}/${batches.length}] Batch ${startIdx}-${endIdx} (${entries.length} items)`);
    
    try {
      const translations = await translateBatch(entries);
      
      for (let j = 0; j < entries.length; j++) {
        const key = entries[j].key;
        const translation = translations[j];
        // Only apply if translation differs from English
        if (translation && translation !== en[key]) {
          ru[key] = translation;
          totalTranslated++;
        }
      }
      
      consecutiveErrors = 0;
      
      // Save after each batch
      const sorted = Object.keys(ru).sort();
      const obj = {};
      for (const k of sorted) obj[k] = ru[k];
      writeFileSync(RU, JSON.stringify(obj, null, 2), 'utf8');
      
      console.log(`  ✅ ${totalTranslated} translated so far (${Math.round(b/batches.length*100)}%)`);
      
      if (b < batches.length - 1) await sleep(1500);
    } catch(e) {
      console.error(`  ❌ Batch ${b+1} failed: ${e.message.substring(0, 100)}`);
      consecutiveErrors++;
      if (consecutiveErrors >= 5) {
        console.log('Too many consecutive errors, stopping');
        break;
      }
      await sleep(20000);
    }
  }
  
  console.log(`\nDone! ${totalTranslated} keys translated to Roman Urdu.`);
}

main().catch(console.error);
