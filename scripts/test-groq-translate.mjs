import { readFileSync } from 'fs';
import Groq from 'groq-sdk';

const API_KEY = process.env.GROQ_API_KEY;
if (!API_KEY) {
  console.error('ERROR: GROQ_API_KEY not set');
  process.exit(1);
}

const groq = new Groq({ apiKey: API_KEY });

const protectedWords = JSON.parse(readFileSync('./scripts/protected-words.json', 'utf8'));

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
  ["lab.analyze", "Analyze"],
  ["lab.calculator", "Calculator"],
  ["class.modules_count", "{count} modules"],
  ["search.no_results", "No labs found matching \"{query}\""],
];

const prompt = `Translate the following English text to Roman Urdu (Urdu written in Latin/English alphabet).

CRITICAL RULES:
1. NEVER translate these protected words - keep them EXACTLY as written: ${protectedWords.slice(0, 40).join(', ')}
2. Preserve ALL template variables like {count}, {name}, {min}, {query} EXACTLY.
3. Preserve ALL HTML tags, special characters, emojis EXACTLY.
4. Preserve ALL numbers, units, formulas EXACTLY.
5. Return ONLY a valid JSON array of translated strings.

Entries to translate (return in same order):
${testEntries.map(([k, v], i) => `[${i}] ${v}`).join('\n')}

Respond with ONLY the JSON array.`;

try {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a Roman Urdu translation expert. Translate English to Roman Urdu. Output ONLY valid JSON arrays.' },
      { role: 'user', content: prompt }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.1,
  });

  const response = completion.choices[0].message.content.trim();
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
} catch (err) {
  console.error('Error:', err.message);
  console.error(err.response?.data || err);
}
