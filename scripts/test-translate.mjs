import { readFileSync } from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('ERROR: GEMINI_API_KEY not set');
  process.exit(1);
}

const protectedWords = JSON.parse(readFileSync('./scripts/protected-words.json', 'utf8'));
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash',
  systemInstruction: `You are a Roman Urdu translation expert. Translate English text to Roman Urdu (Urdu written in Latin/English alphabet).

CRITICAL RULES:
1. Preserve ALL protected words EXACTLY as given.
2. Preserve ALL template variables like {count}, {name}, {min} EXACTLY.
3. Preserve ALL HTML tags, special characters, emojis EXACTLY.
4. Preserve ALL numbers, units, formulas EXACTLY.
5. NEVER translate the protected words.` 
});

// Test with some sample keys
const testEntries = [
  ["nav.home", "Home"],
  ["nav.search", "Search"],
  ["nav.history", "History"],
  ["nav.settings", "Settings"],
  ["auth.log_in", "Log In"],
  ["auth.sign_out", "Sign Out"],
  ["auth.register", "Register"],
  ["class.select", "Select Class"],
  ["class.platform_tagline", "Interactive Learning Platform"],
  ["search.placeholder", "Search modules..."],
  ["lab.check_answer", "Check Answer"],
  ["lab.next_step", "Next Step"],
  ["lab.restart", "Restart"],
  ["lab.calculator", "Calculator"],
  ["class.modules_count", "{count} modules"],
  ["search.no_results", "No labs found matching \"{query}\""],
];

const prompt = `Translate the following English text to Roman Urdu (Urdu written in Latin/English alphabet).

PROTECTED WORDS (do NOT translate these - keep them EXACTLY):
${protectedWords.slice(0, 30).map(w => `- "${w}"`).join('\n')}

Entries to translate:
${testEntries.map(([k, v], i) => `[${i}] ${v}`).join('\n')}

Respond with ONLY a valid JSON array of translated strings, in order. Example: ["trans1", "trans2"]`;

const result = await model.generateContent(prompt);
const response = result.response.text().trim();
console.log('Raw response:', response);

let clean = response;
if (clean.startsWith('```json')) clean = clean.replace(/^```json\n?/, '').replace(/\n?```$/, '');
else if (clean.startsWith('```')) clean = clean.replace(/^```\n?/, '').replace(/\n?```$/, '');

const translations = JSON.parse(clean);
console.log('\n=== Results ===');
testEntries.forEach(([key, eng], i) => {
  console.log(`\n${key}:`);
  console.log(`  EN: ${eng}`);
  console.log(`  RU: ${translations[i]}`);
});
