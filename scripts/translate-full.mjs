import { readFileSync, writeFileSync, existsSync } from 'fs';
import Groq from 'groq-sdk';

const BATCH_SIZE = 100; // Number of keys per batch
const BATCH_DELAY_MS = 3000; // Delay between batches
const ENGLISH_FILE = './src/locales/en/translation.json';
const ROMAN_URDU_FILE = './src/locales/roman-urdu/translation.json';
const PROTECTED_WORDS_FILE = './scripts/protected-words.json';

const API_KEY = process.env.GROQ_API_KEY;
if (!API_KEY) {
  console.error('ERROR: GROQ_API_KEY not set');
  process.exit(1);
}

const groq = new Groq({ apiKey: API_KEY });

const en = JSON.parse(readFileSync(ENGLISH_FILE, 'utf8'));
const protectedWords = JSON.parse(readFileSync(PROTECTED_WORDS_FILE, 'utf8'));

let ru = {};
if (existsSync(ROMAN_URDU_FILE)) {
  try {
    ru = JSON.parse(readFileSync(ROMAN_URDU_FILE, 'utf8'));
    console.log(`Loaded ${Object.keys(ru).length} existing RU translations`);
  } catch (e) {
    console.log('Starting fresh RU file');
    ru = {};
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

function escapeForPrompt(text) {
  // Escape backslashes and quotes for the prompt
  return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

async function translateBatch(batchEntries) {
  const maxRetries = 3;
  
  // Build entries section with minimal escaping
  const entriesStr = batchEntries.map(([key, value], i) => {
    return `[${i}] ${value}`;
  }).join('\n');

  const prompt = `Translate these English texts to Roman Urdu (Urdu in English/Latin alphabet).

EXAMPLES:
- "Welcome to Class 10 Physics" → "Class 10 Physics mein khush aamdeed"
- "Click to start the experiment" → "Tajurba shuru karne ke liye click karein"
- "Record your measurements here" → "Apni pemaish yahan darj karein"
- "Force equals mass times acceleration" → "Force mass aur acceleration ke zarb ke barabar hota hai"

RULES:
1. NEVER translate these PROTECTED words - keep EXACTLY as written: ${protectedWords.join(', ')}
2. Preserve ALL template variables like {count}, {name}, {num}, {min}, {n}, {query} EXACTLY.
3. Preserve ALL numbers (123, 0.5, etc.), units (m/s, kg, N, J, etc.), formulas EXACTLY.
4. Preserve ALL special characters, emojis, arrows, HTML tags EXACTLY.
5. Preserve ALL text in [square brackets] EXACTLY.
6. If a text is mostly numbers/formulas/protected words, keep it close to original.
7. Translate the MEANING, not word-by-word. Use natural Roman Urdu.

Entries to translate (return in SAME order):
${entriesStr}

Respond with ONLY a JSON array of translated strings. Example format: ["trans1", "trans2"]`;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { 
            role: 'system', 
            content: 'You are a Roman Urdu translation expert. Translate English text to Roman Urdu (Urdu written in English/Latin alphabet). Output ONLY a valid JSON array of translated strings, nothing else.' 
          },
          { role: 'user', content: prompt }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.1,
        max_tokens: 4096,
      });

      const response = completion.choices[0].message.content.trim();
      
      // Clean up markdown fences
      let clean = response;
      if (clean.startsWith('```json')) clean = clean.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      else if (clean.startsWith('```')) clean = clean.replace(/^```\n?/, '').replace(/\n?```$/, '');
      
      const translations = JSON.parse(clean);
      
      if (!Array.isArray(translations) || translations.length !== batchEntries.length) {
        throw new Error(`Expected ${batchEntries.length} translations, got ${translations.length}`);
      }
      
      return translations;
    } catch (error) {
      console.error(`  Attempt ${attempt + 1}/${maxRetries} failed: ${error.message.substring(0, 100)}`);
      if (attempt < maxRetries - 1) {
        const waitTime = 5000 * (attempt + 1);
        console.log(`  Waiting ${waitTime}ms before retry...`);
        await sleep(waitTime);
      } else {
        throw error;
      }
    }
  }
}

async function main() {
  const enKeys = Object.keys(en);
  const totalKeys = enKeys.length;
  
  // Filter keys that still need translation
  const keysToTranslate = enKeys.filter(k => ru[k] === undefined);
  
  console.log(`Total English keys: ${totalKeys}`);
  console.log(`Already translated: ${totalKeys - keysToTranslate.length}`);
  console.log(`Keys to translate: ${keysToTranslate.length}`);
  console.log(`Batch size: ${BATCH_SIZE}`);
  console.log(`Estimated batches: ${Math.ceil(keysToTranslate.length / BATCH_SIZE)}`);
  
  const batches = chunkArray(keysToTranslate, BATCH_SIZE);
  let translatedCount = 0;
  let failedCount = 0;
  
  for (let b = 0; b < batches.length; b++) {
    const batchKeys = batches[b];
    const batchEntries = batchKeys.map(k => [k, en[k]]);
    
    console.log(`\n--- Batch ${b + 1}/${batches.length} (keys ${(b * BATCH_SIZE) + 1} to ${(b * BATCH_SIZE) + batchKeys.length}) ---`);
    
    try {
      const translations = await translateBatch(batchEntries);
      
      for (let j = 0; j < batchKeys.length; j++) {
        ru[batchKeys[j]] = translations[j];
        translatedCount++;
      }
      
      console.log(`  ✓ Translated ${translations.length} keys (total: ${translatedCount})`);
      
      // Save after each batch
      const sortedKeys = Object.keys(ru).sort();
      const sortedObj = {};
      for (const k of sortedKeys) {
        sortedObj[k] = ru[k];
      }
      writeFileSync(ROMAN_URDU_FILE, JSON.stringify(sortedObj, null, 2), 'utf8');
      console.log(`  💾 Saved (${sortedKeys.length}/${totalKeys} keys, ${Math.round(sortedKeys.length / totalKeys * 100)}%)`);
      
    } catch (error) {
      console.error(`  ✗ Batch ${b + 1} completely failed: ${error.message.substring(0, 200)}`);
      failedCount += batchKeys.length;
    }
    
    // Delay between batches
    if (b < batches.length - 1) {
      const progress = Math.round(((b + 1) / batches.length) * 100);
      console.log(`  ⏳ Waiting ${BATCH_DELAY_MS}ms... (${progress}% complete)`);
      await sleep(BATCH_DELAY_MS);
    }
  }
  
  console.log(`\n=== COMPLETE ===`);
  console.log(`Successfully translated: ${translatedCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Total RU file: ${Object.keys(ru).length} keys`);
}

main().catch(console.error);
