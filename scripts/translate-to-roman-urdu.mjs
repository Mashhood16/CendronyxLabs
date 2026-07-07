import { readFileSync, writeFileSync, existsSync } from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuration
const BATCH_SIZE = 200; // Number of keys per batch
const BATCH_DELAY_MS = 2000; // Delay between batches to avoid rate limits
const ENGLISH_FILE = './src/locales/en/translation.json';
const ROMAN_URDU_FILE = './src/locales/roman-urdu/translation.json';
const PROTECTED_WORDS_FILE = './scripts/protected-words.json';
const PROGRESS_FILE = './scripts/translation-progress.json';
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable not set!');
  process.exit(1);
}

// Load files
const en = JSON.parse(readFileSync(ENGLISH_FILE, 'utf8'));
const protectedWords = JSON.parse(readFileSync(PROTECTED_WORDS_FILE, 'utf8'));

// Build protected words set for fast lookup (case-sensitive)
const protectedSet = new Set(protectedWords);

// Load existing Roman Urdu translations (if any)
let ru = {};
if (existsSync(ROMAN_URDU_FILE)) {
  try {
    ru = JSON.parse(readFileSync(ROMAN_URDU_FILE, 'utf8'));
  } catch (e) {
    console.log('Existing RU file is invalid/empty, starting fresh');
    ru = {};
  }
}

// Load progress
let progress = {};
if (existsSync(PROGRESS_FILE)) {
  progress = JSON.parse(readFileSync(PROGRESS_FILE, 'utf8'));
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash',
  systemInstruction: `You are a Roman Urdu translation expert. Your task is to translate English text to Roman Urdu.

Roman Urdu is Urdu written in the Latin (English) alphabet. For example:
- "Hello, how are you?" → "Assalam-o-Alaikum, aap kaise hain?"
- "Please sit down" → "Meherbani farma kar baithein"
- "What is your name?" → "Aap ka naam kya hai?"

CRITICAL RULES:
1. Preserve ALL protected words EXACTLY as given (do not translate them).
2. Preserve ALL template variables like {count}, {name}, {number}, {n}, {min}, {max}, etc. EXACTLY.
3. Preserve ALL HTML tags like <strong>, <br/>, <em>, <code>, etc. EXACTLY.
4. Preserve ALL mathematical notation, formulas, units (like m/s, kg, N, J, Pa, Ω, °C, etc.) EXACTLY.
5. Preserve ALL special characters, emojis, arrows, symbols EXACTLY.
6. Preserve ALL numbers and numeric expressions EXACTLY.
7. The output must be valid JSON value - escape quotes properly.
8. NEVER translate the protected words list.
9. For scientific/technical content, keep technical terms in English if they are commonly used that way in Urdu context.
10. For complex multi-sentence content, provide a natural Roman Urdu translation.` 
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildProtectedWordsPrompt() {
  return `PROTECTED WORDS (do NOT translate these - keep them EXACTLY as written, preserving capitalization):
${protectedWords.map(w => `- "${w}"`).join('\n')}

When any of these words appear in the text, keep them exactly as they are without translating or modifying them.`;
}

function buildTranslationPrompt(entries) {
  const entriesStr = entries.map(([key, value], i) => {
    // Escape the value for JSON to handle special characters
    return `[${i}] KEY: ${key}\nENGLISH: ${value}`;
  }).join('\n\n');

  return `Translate the following English text entries to Roman Urdu (Urdu written in Latin/English alphabet).

${buildProtectedWordsPrompt()}

IMPORTANT FORMAT INSTRUCTIONS:
- For each entry, provide ONLY the Roman Urdu translation text
- Do NOT include the key name in your response
- Preserve ALL template variables like {count}, {name}, {min}, etc. exactly as they appear
- Preserve ALL units, numbers, and scientific notation exactly
- Preserve ALL HTML tags and emojis exactly
- If the text is already a number, formula, or special symbol, return it as-is

ENTRIES TO TRANSLATE:
${entriesStr}

Respond with ONLY a valid JSON array of translated strings, in the same order. Example format:
["translation1", "translation2", "translation3"]

Do NOT include any other text or explanation.`;
}

async function translateBatch(entries) {
  const maxRetries = 3;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const prompt = buildTranslationPrompt(entries);
      const result = await model.generateContent(prompt);
      const response = result.response.text().trim();
      
      // Try to parse as JSON array
      // Clean up markdown code fences if present
      let cleanResponse = response;
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }
      
      const translations = JSON.parse(cleanResponse);
      
      if (!Array.isArray(translations) || translations.length !== entries.length) {
        throw new Error(`Expected ${entries.length} translations, got ${translations.length}`);
      }
      
      return translations;
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed: ${error.message}`);
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
  
  // Find keys that still need translation
  const keysToTranslate = enKeys.filter(k => {
    if (ru[k] !== undefined) return false; // Already translated
    if (progress[k] === 'failed') return false; // Marked as permanently failed
    return true;
  });
  
  console.log(`Total English keys: ${totalKeys}`);
  console.log(`Already translated: ${totalKeys - keysToTranslate.length}`);
  console.log(`Keys to translate: ${keysToTranslate.length}`);
  console.log(`Batch size: ${BATCH_SIZE}`);
  console.log(`Estimated batches: ${Math.ceil(keysToTranslate.length / BATCH_SIZE)}`);
  
  let translatedCount = 0;
  let failedCount = 0;
  
  // Process in batches
  for (let i = 0; i < keysToTranslate.length; i += BATCH_SIZE) {
    const batchKeys = keysToTranslate.slice(i, i + BATCH_SIZE);
    const batchEntries = batchKeys.map(k => [k, en[k]]);
    
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(keysToTranslate.length / BATCH_SIZE);
    console.log(`\n--- Batch ${batchNum}/${totalBatches} (keys ${i + 1} to ${Math.min(i + BATCH_SIZE, keysToTranslate.length)}) ---`);
    
    try {
      const translations = await translateBatch(batchEntries);
      
      for (let j = 0; j < batchKeys.length; j++) {
        ru[batchKeys[j]] = translations[j];
        translatedCount++;
      }
      
      console.log(`✓ Batch ${batchNum} translated successfully (${translations.length} keys)`);
      
      // Save progress after each batch
      const ruKeys = Object.keys(ru).sort();
      const ruObj = {};
      for (const k of ruKeys) {
        ruObj[k] = ru[k];
      }
      writeFileSync(ROMAN_URDU_FILE, JSON.stringify(ruObj, null, 2), 'utf8');
      console.log(`  Saved to ${ROMAN_URDU_FILE} (${ruKeys.length} keys, ${Math.round(ruKeys.length / totalKeys * 100)}% complete)`);
      
    } catch (error) {
      console.error(`✗ Batch ${batchNum} failed: ${error.message}`);
      // Mark these keys as failed
      for (const key of batchKeys) {
        progress[key] = 'failed';
      }
      writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf8');
      failedCount += batchKeys.length;
    }
    
    // Delay between batches
    if (i + BATCH_SIZE < keysToTranslate.length) {
      console.log(`  Waiting ${BATCH_DELAY_MS}ms before next batch...`);
      await sleep(BATCH_DELAY_MS);
    }
  }
  
  console.log(`\n=== Translation Complete ===`);
  console.log(`Successfully translated: ${translatedCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Total in RU file: ${Object.keys(ru).length}`);
}

main().catch(console.error);
