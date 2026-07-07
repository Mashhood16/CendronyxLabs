import { readFileSync, writeFileSync, existsSync } from 'fs';

const BATCH_SIZE = 100;
const BATCH_DELAY_MS = 1500;
const ENGLISH_FILE = './src/locales/en/translation.json';
const ROMAN_URDU_FILE = './src/locales/roman-urdu/translation.json';
const PROTECTED_WORDS_FILE = './scripts/protected-words.json';

const API_KEY = process.env.OPENROUTER_API_KEY;
if (!API_KEY) {
  console.error('ERROR: OpenRouter API key not set');
  process.exit(1);
}

const en = JSON.parse(readFileSync(ENGLISH_FILE, 'utf8'));
const protectedWords = JSON.parse(readFileSync(PROTECTED_WORDS_FILE, 'utf8'));

// Build optimized protected words - focus on the ones most likely to appear
const coreProtected = protectedWords.slice(0, 60); // Just the most common ones

let ru = {};
if (existsSync(ROMAN_URDU_FILE)) {
  try {
    ru = JSON.parse(readFileSync(ROMAN_URDU_FILE, 'utf8'));
    console.log(`Loaded ${Object.keys(ru).length} existing RU translations`);
  } catch (e) {
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

async function translateWithOpenRouter(batchEntries) {
  const maxRetries = 3;
  
  // Build optimized prompt (shorter protected words list, concise instructions)
  const entriesStr = batchEntries.map(([key, value], i) => {
    return `[${i}] ${value}`;
  }).join('\n');

  const prompt = `Translate these English texts to Roman Urdu (Urdu in English/Latin alphabet).

RULES:
- NEVER translate these protected words/terms: Modules, History, Settings, Home, Search, Class, Curriculum, Log In, Sign Out, Physics, Chemistry, Biology, Math, Lab, Calculator, Simulation, Derivation, Input, Output
- Preserve ALL template variables like {count}, {name}, {min}, {n}, {query} EXACTLY
- Preserve ALL numbers, units (m/s, kg, N, J, Pa, Ω, °C), formulas EXACTLY
- Preserve ALL special characters, emojis, arrows, HTML tags EXACTLY
- Translate the MEANING, not word-by-word. Use natural Roman Urdu
- For scientific content, keep technical terms in English if commonly used in Urdu science education

EXAMPLES:
"Select Class" → "Class muntakhib karein"
"Check Answer" → "Jawab check karein"
"Next Step" → "Agla qadam"
"Interactive Learning Platform" → "Ba-hami amal seekhnay ka Platform"
"Instructions" → "Hidayat"
"Theory" → "Nazriya"
"Hint" → "Ishara"

Entries:
${entriesStr}

Respond with ONLY a JSON array of translations.`;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [
            { role: 'system', content: 'You are a Roman Urdu translation expert. Translate English to Roman Urdu. Output ONLY valid JSON arrays.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 8192,
        })
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText.substring(0, 200)}`);
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      
      // Parse JSON from response
      let clean = content;
      if (clean.startsWith('```json')) clean = clean.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      else if (clean.startsWith('```')) clean = clean.replace(/^```\n?/, '').replace(/\n?```$/, '');
      
      const translations = JSON.parse(clean);
      
      if (!Array.isArray(translations) || translations.length !== batchEntries.length) {
        throw new Error(`Expected ${batchEntries.length} translations, got ${translations.length}`);
      }
      
      return translations;
    } catch (error) {
      console.error(`  Attempt ${attempt + 1}/${maxRetries} failed: ${error.message.substring(0, 150)}`);
      if (attempt < maxRetries - 1) {
        await sleep(5000 * (attempt + 1));
      } else {
        throw error;
      }
    }
  }
}

async function main() {
  const enKeys = Object.keys(en);
  const totalKeys = enKeys.length;
  
  const keysToTranslate = enKeys.filter(k => ru[k] === undefined);
  
  console.log(`Total English keys: ${totalKeys}`);
  console.log(`Already translated: ${totalKeys - keysToTranslate.length}`);
  console.log(`Keys to translate: ${keysToTranslate.length}`);
  
  const batches = chunkArray(keysToTranslate, BATCH_SIZE);
  console.log(`Batch size: ${BATCH_SIZE}, Total batches: ${batches.length}`);
  
  let translatedCount = 0;
  let failedCount = 0;
  
  for (let b = 0; b < batches.length; b++) {
    const batchKeys = batches[b];
    const batchEntries = batchKeys.map(k => [k, en[k]]);
    
    console.log(`\n--- Batch ${b + 1}/${batches.length} (keys ${(b * BATCH_SIZE) + 1} to ${(b * BATCH_SIZE) + batchKeys.length}) ---`);
    
    try {
      const translations = await translateWithOpenRouter(batchEntries);
      
      for (let j = 0; j < batchKeys.length; j++) {
        ru[batchKeys[j]] = translations[j];
        translatedCount++;
      }
      
      console.log(`  ✓ Translated (total: ${translatedCount}/${keysToTranslate.length})`);
      
      // Save after each batch
      const sortedKeys = Object.keys(ru).sort();
      const sortedObj = {};
      for (const k of sortedKeys) sortedObj[k] = ru[k];
      writeFileSync(ROMAN_URDU_FILE, JSON.stringify(sortedObj, null, 2), 'utf8');
      console.log(`  💾 Saved (${sortedKeys.length}/${totalKeys} keys, ${Math.round(sortedKeys.length / totalKeys * 100)}%)`);
      
    } catch (error) {
      console.error(`  ✗ Batch ${b + 1} failed: ${error.message.substring(0, 200)}`);
      failedCount += batchKeys.length;
      // Don't stop on failure, try next batch
    }
    
    if (b < batches.length - 1) {
      console.log(`  Waiting ${BATCH_DELAY_MS}ms...`);
      await sleep(BATCH_DELAY_MS);
    }
  }
  
  console.log(`\n=== COMPLETE ===`);
  console.log(`Translated: ${translatedCount}, Failed: ${failedCount}, Total RU: ${Object.keys(ru).length}`);
}

main().catch(console.error);
