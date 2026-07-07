/**
 * Translate theorem entries from English to natural Roman Urdu.
 * Handles all 1,209 theorem keys across 84 theorems.
 * Uses Groq API with better error handling and prompt engineering.
 * 
 * Run: GROQ_API_KEY=gsk_xxx node scripts/translate-theorems-urdu-v2.mjs
 */
import { readFileSync, writeFileSync } from 'fs';

const EN = './src/locales/en/translation.json';
const RU = './src/locales/roman-urdu/translation.json';
const PROTECTED = './scripts/protected-words.json';

const KEY = process.env.GROQ_API_KEY;
if (!KEY) { console.error('No Groq key (set GROQ_API_KEY)'); process.exit(1); }

const en = JSON.parse(readFileSync(EN, 'utf8'));
const protectedWords = JSON.parse(readFileSync(PROTECTED, 'utf8'));
const ru = JSON.parse(readFileSync(RU, 'utf8'));

// Find theorem keys that need translation (still English = not yet translated)
const theoremKeys = Object.keys(en).filter(k => k.startsWith('theorem.'));
const toTranslate = theoremKeys.filter(k => !ru[k] || ru[k] === 'undefined' || ru[k] === en[k]);

console.log(`Theorem keys: ${theoremKeys.length}`);
console.log(`Need translation: ${toTranslate.length}`);
console.log(`Already translated: ${theoremKeys.length - toTranslate.length}`);

if (toTranslate.length === 0) {
  console.log('All theorem entries already translated!');
  process.exit(0);
}

const BATCH_SIZE = 10; // Smaller batches for better quality

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function chunk(a, s) { const c=[]; for(let i=0; i<a.length; i+=s) c.push(a.slice(i,i+s)); return c; }

async function translateBatch(entries) {
  // Build the text to translate with numbered items
  const textItems = entries.map((key, i) => {
    const val = en[key];
    return `${i+1}. ${val}`;
  });
  const text = textItems.join('\n');

  const systemPrompt = `You are a Roman Urdu translator. Convert English text to natural Roman Urdu.

CRITICAL RULES:
1. NEVER translate these words (keep EXACTLY as-is): ${protectedWords.join(', ')}
2. Keep ALL {variables}, numbers, math notation (log₂, √, ², ³, =, ±, ∑, etc.), HTML tags, emojis (🧮, 📐, ✅, etc.), [brackets], and CSS classes EXACTLY as-is
3. Translate EVERYDAY verbs, pronouns, objects naturally (you→aap/tum, is→hai, are→hain, the→tha/thi, a→ek, etc.)
4. Keep scientific/mathematical terms in English: "logarithm", "derivative", "integral", "exponent", "coefficient", "amplitude", "frequency", "velocity", "acceleration", "momentum", "equation", "formula", "theorem", "function", "vector", "matrix", "determinant", "hypotenuse", "radius", "diameter", "circumference", "slope", "intercept", "tangent", "cosine", "sine", "Pythagorean", "quadratic", "polynomial", "binomial", "permutation", "combination"
5. Use COMMON everyday Urdu words only: "hai" (is), "hain" (are), "tha" (was), "the" (were), "aap" (you), "yeh" (this), "woh" (that/they), "aur" (and), "ya" (or), "ka" (of), "ki" (of - feminine), "ke" (of - plural), "mein" (in), "se" (from/by), "par" (on), "tak" (until), "liye" (for), "sath" (with), "bhi" (also), "hi" (only/very), "hai" (is/are), "karta/karti" (does), "kar" (do), "ho" (be), "rakhta/rakhti" (has/holds)
6. DO NOT use uncommon/classical Urdu words that aren't used in everyday conversation. Prefer common words.
7. Return ONLY a valid JSON array of translated strings. Each translation should sound natural in spoken Urdu.
8. STRICTLY AVOID HINDI VOCABULARY. Do NOT use Hindi words like prayog, udhaharan, kshetra, vastavik, karya, shabd, vishay, prastut, etc. Use ONLY pure Urdu equivalents written in English alphabets (Roman Urdu) such as istamal, misal, raquba, asli, kaam, lafz, mozou, paish, etc.

Example style:
- "You're a sound engineer" → "Aap ek sound engineer hain"
- "The log of a product equals the sum of the logs" → "Product ka log, logs ke sum ke barabar hota hai"
- "Set up variables" → "Variables set up karein"`;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Translate these to natural Roman Urdu. Return ONLY a JSON array. No other text.\n\n${text}` }
          ],
          temperature: 0.1,
          max_tokens: 4096,
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 429) {
          const wait = Math.min(60000, 5000 * Math.pow(2, attempt));
          console.log(`  ⏳ Rate limited, waiting ${wait/1000}s...`);
          await sleep(wait);
          continue;
        }
        console.log(`  ⚠️ HTTP ${res.status}: ${errText.substring(0, 100)}`);
        await sleep(10000);
        continue;
      }

      const data = await res.json();
      let content = data.choices[0].message.content.trim();

      // Clean markdown code blocks
      content = content.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '');

      // Try to extract JSON array
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) content = jsonMatch[0];

      // Try parsing
      let translations;
      try {
        translations = JSON.parse(content);
      } catch (parseErr) {
        // Maybe the content has trailing commas or other issues - try to clean
        content = content.replace(/,\s*([\]}])/g, '$1'); // Remove trailing commas
        try {
          translations = JSON.parse(content);
        } catch (e2) {
          console.log(`  ⚠️ Parse error: ${parseErr.message.substring(0,60)}`);
          console.log(`  Content starts: ${content.substring(0,100)}`);
          await sleep(5000);
          continue;
        }
      }

      if (!Array.isArray(translations)) throw new Error('Not an array');
      if (translations.length !== entries.length)
        throw new Error(`Expected ${entries.length}, got ${translations.length}`);

      // Validate no "undefined" values
      for (let j = 0; j < translations.length; j++) {
        if (translations[j] === 'undefined' || translations[j] === 'null') {
          throw new Error(`Translation ${j+1} is "${translations[j]}"`);
        }
      }

      return translations;
    } catch(e) {
      console.error(`  ❌ Attempt ${attempt+1}: ${e.message.substring(0,100)}`);
      await sleep(5000 * (attempt + 1));
    }
  }
  
  // If all attempts fail, return English placeholders
  console.error(`  ⚠️ All attempts failed, using English for this batch`);
  return entries.map(key => en[key]);
}

async function main() {
  const batches = chunk(toTranslate, BATCH_SIZE);
  console.log(`Batches: ${batches.length}`);

  let consecutiveErrors = 0;
  let totalTranslated = 0;

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    console.log(`\n[${b+1}/${batches.length}] (${batch.length} entries)`);

    try {
      const translations = await translateBatch(batch);
      let hadInvalid = false;
      for (let j = 0; j < batch.length; j++) {
        let val = translations[j];
        if (typeof val === 'object' && val !== null) {
          val = val.text || val.translation || Object.values(val)[0] || '';
        }
        if (typeof val !== 'string') {
          val = String(val);
        }
        if (val && val !== 'undefined' && val !== 'null') {
          ru[batch[j]] = val;
          totalTranslated++;
        } else {
          ru[batch[j]] = en[batch[j]]; // fallback to English
          hadInvalid = true;
        }
      }

      if (hadInvalid) {
        console.log('  ⚠️ Some translations had invalid values, used English fallback');
      }

      consecutiveErrors = 0;

      // Save progress periodically
      const sorted = Object.keys(ru).sort();
      const obj = {};
      for (const k of sorted) obj[k] = ru[k];
      writeFileSync(RU, JSON.stringify(obj, null, 2), 'utf8');

      const done = theoremKeys.filter(k => ru[k] && ru[k] !== 'undefined' && ru[k] !== en[k]).length;
      const pct = Math.round(done / theoremKeys.length * 100);
      console.log(`  ✅ ${done}/${theoremKeys.length} = ${pct}%`);

      if (b < batches.length - 1) {
        await sleep(2000); // Rate limiting
      }
    } catch(e) {
      console.error(`  ❌ Batch ${b+1} failed: ${e.message.substring(0,100)}`);
      consecutiveErrors++;
      if (consecutiveErrors >= 3) {
        console.log('Too many consecutive errors, stopping');
        break;
      }
      await sleep(20000);
    }
  }

  const finalDone = theoremKeys.filter(k => ru[k] && ru[k] !== 'undefined' && ru[k] !== en[k]).length;
  const stillEnglish = theoremKeys.filter(k => !ru[k] || ru[k] === 'undefined' || ru[k] === en[k]);
  
  console.log(`\n=== Final Results ===`);
  console.log(`Translated: ${finalDone}/${theoremKeys.length}`);
  
  if (stillEnglish.length > 0) {
    console.log(`Still English: ${stillEnglish.length}`);
    for (const k of stillEnglish.slice(0, 3)) {
      console.log(`  - ${k}: ${(en[k] || '').substring(0, 60)}`);
    }
  }

  // Final save
  const sorted = Object.keys(ru).sort();
  const obj = {};
  for (const k of sorted) obj[k] = ru[k];
  writeFileSync(RU, JSON.stringify(obj, null, 2), 'utf8');
  console.log('Final save complete');
}

main().catch(console.error);
