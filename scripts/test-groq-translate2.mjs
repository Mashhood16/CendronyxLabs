import { readFileSync } from 'fs';
import Groq from 'groq-sdk';

const API_KEY = process.env.GROQ_API_KEY;
if (!API_KEY) {
  console.error('ERROR: GROQ_API_KEY not set');
  process.exit(1);
}

const groq = new Groq({ apiKey: API_KEY });

const protectedWords = JSON.parse(readFileSync('./scripts/protected-words.json', 'utf8'));

const testEntries = [
  ["nav.home", "Home"],
  ["nav.search", "Search"],
  ["nav.history", "History"],
  ["nav.settings", "Settings"],
  ["auth.log_in", "Log In"],
  ["auth.sign_out", "Sign Out"],
  ["class.select", "Select Class"],
  ["class.platform_tagline", "Interactive Learning Platform"],
  ["search.placeholder", "Search modules..."],
  ["lab.calculator", "Calculator"],
  ["class.modules_count", "{count} modules"],
  ["search.no_results", "No labs found matching \"{query}\""],
  ["lab.check_answer", "Check Answer"],
  ["lab.restart", "Restart"],
  ["lab.next_step", "Next Step"],
  ["lab.observe", "Observe"],
  ["lab.record", "Record"],
  ["lab.analyze", "Analyze"],
  ["lab.conclude", "Conclude"],
  ["lab.instructions", "Instructions"],
  ["lab.objective", "Objective"],
  ["lab.theory", "Theory"],
  ["lab.hint", "Hint"],
  ["lab.simulation", "Simulation"],
  ["lab.input", "Input"],
  ["lab.output", "Output"],
];

const prompt = `You are a Roman Urdu translator. Roman Urdu is Urdu written in the English/Latin alphabet.

EXAMPLES of English → Roman Urdu:
- "Hello" → "Salam"
- "Welcome" → "Khush aamdeed"
- "Good morning" → "Subah bakhair"
- "Please enter your name" → "Meherbani apna naam darj karein"
- "Click here to continue" → "Jaari rakhne ke liye yahan click karein"
- "Select an option" → "Ek option muntakhib karein"
- "Start the experiment" → "Tajurba shuru karein"
- "Record your observation" → "Apna mushaheda darj karein"
- "Instructions" → "Hidayat"
- "Objective" → "Maqsad"
- "Theory" → "Nazriya"
- "Hint" → "Ishara"
- "Observe" → "Mushaheda karein"
- "Record" → "Darj karein"
- "Analyze" → "Tajzia karein"
- "Conclude" → "Natija akhaz karein"
- "Next Step" → "Agla qadam"
- "Check Answer" → "Jawab check karein"
- "Restart" → "Dobara shuru karein"
- "Interactive Learning Platform" → "Ba-hami amal seekhnay ka Platform"
- "Select Class" → "Class muntakhib karein"
- "Search modules" → "Asbaaq talash karein"

RULES:
1. Protected words (keep EXACTLY, do NOT translate): ${protectedWords.join(', ')}
2. Preserve ALL template variables like {count}, {query}, {name} EXACTLY.
3. Do NOT add extra quotes, punctuation, or explanation.
4. Return ONLY a valid JSON array of strings.

Entries to translate (return in SAME order):
${testEntries.map(([k, v], i) => `[${i}] ${v}`).join('\n')}

Respond with ONLY the JSON array.`;

try {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a Roman Urdu translation expert. Translate English to Roman Urdu. Output ONLY valid JSON arrays without any extra text.' },
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
}
