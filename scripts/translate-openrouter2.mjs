import { readFileSync, writeFileSync, existsSync } from 'fs';

const BATCH_SIZE = 100;
const BATCH_DELAY_MS = 1000;
const ENGLISH_FILE = './src/locales/en/translation.json';
const ROMAN_URDU_FILE = './src/locales/roman-urdu/translation.json';
const PROTECTED_WORDS_FILE = './scripts/protected-words.json';

const API_KEY = process.env.OPENROUTER_API_KEY;
if (!API_KEY) { console.error('ERROR: OpenRouter key not set'); process.exit(1); }

const en = JSON.parse(readFileSync(ENGLISH_FILE, 'utf8'));
const protectedWords = JSON.parse(readFileSync(PROTECTED_WORDS_FILE, 'utf8'));

let ru = {};
if (existsSync(ROMAN_URDU_FILE)) {
  try { ru = JSON.parse(readFileSync(ROMAN_URDU_FILE, 'utf8')); console.log(`Loaded ${Object.keys(ru).length} existing`); }
  catch(e) { ru = {}; }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function chunk(a, s) { const c = []; for (let i=0; i<a.length; i+=s) c.push(a.slice(i,i+s)); return c; }

async function translateBatch(entries) {
  const maxRetries = 3;
  const entriesStr = entries.map(([k, v], i) => `[${i}] ${v}`).join('\n');
  
  const prompt = `Translate these to Roman Urdu (Urdu in English/Latin alphabet). 
Rules:
- NEVER translate: Modules, History, Settings, Home, Search, Class, Curriculum, Log In, Sign Out, Physics, Chemistry, Biology, Math, Lab, Calculator, Simulation, Derivation, Input, Output, Score, Score, Mass, Current, Velocity, Force, Acceleration, Momentum, Pressure, Density, Voltage, Resistance, Frequency, Wavelength, Energy, Power, Gravity, Magnet, Magnet, Ohm, Watt, Joule, Newton, Pascal
- Preserve ALL {variables}, numbers, units (m/s, kg, N, J, Pa, Ω, °C), <html>, emojis, [brackets] EXACTLY
- Use natural Roman Urdu

Examples: "Select Class"→"Class muntakhib karein", "Check Answer"→"Jawab check karein", "Next Step"→"Agla qadam", "Instructions"→"Hidayat", "Theory"→"Nazriya", "Hint"→"Ishara", "Analyze"→"Tajzia karein", "Record"→"Darj karein", "Observe"→"Mushaheda karein"

Entries:
${entriesStr}

Return ONLY a JSON array of translations.`;

  for (let a = 0; a < maxRetries; a++) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct',
          messages: [
            { role: 'system', content: 'You translate English to Roman Urdu. Output ONLY valid JSON arrays.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 8192,
        })
      });
      if (!res.ok) {
        const err = await res.text();
        if (res.status === 429) { console.log(`  Rate limited, waiting...`); await sleep(15000); continue; }
        throw new Error(`HTTP ${res.status}: ${err.substring(0,200)}`);
      }
      const data = await res.json();
      let content = data.choices[0].message.content.trim();
      if (content.startsWith('```json')) content = content.replace(/^```json\n?/,'').replace(/\n?```$/,'');
      else if (content.startsWith('```')) content = content.replace(/^```\n?/,'').replace(/\n?```$/,'');
      const translations = JSON.parse(content);
      if (!Array.isArray(translations) || translations.length !== entries.length)
        throw new Error(`Expected ${entries.length}, got ${translations.length}`);
      return translations;
    } catch(e) {
      console.error(`  Attempt ${a+1}: ${e.message.substring(0,150)}`);
      if (a < maxRetries-1) await sleep(5000*(a+1));
      else throw e;
    }
  }
}

async function main() {
  const enKeys = Object.keys(en);
  const totalKeys = enKeys.length;
  const toTranslate = enKeys.filter(k => ru[k] === undefined);
  console.log(`Total: ${totalKeys}, Already: ${totalKeys - toTranslate.length}, To do: ${toTranslate.length}`);
  
  const batches = chunk(toTranslate, BATCH_SIZE);
  let done = 0, failed = 0;
  
  for (let b = 0; b < batches.length; b++) {
    console.log(`\nBatch ${b+1}/${batches.length} (${b*BATCH_SIZE+1}-${b*BATCH_SIZE+batches[b].length})`);
    try {
      const t = await translateBatch(batches[b].map(k => [k, en[k]]));
      for (let j = 0; j < batches[b].length; j++) ru[batches[b][j]] = t[j];
      done += batches[b].length;
      
      const sorted = Object.keys(ru).sort();
      const obj = {};
      for (const k of sorted) obj[k] = ru[k];
      writeFileSync(ROMAN_URDU_FILE, JSON.stringify(obj, null, 2), 'utf8');
      console.log(`  ✓ (${done}/${toTranslate.length}, ${Math.round((done+Object.keys(ru).length-batches[b].length)/totalKeys*100)}%)`);
      
      if (b < batches.length - 1) await sleep(BATCH_DELAY_MS);
    } catch(e) {
      console.error(`  ✗ ${e.message.substring(0,100)}`);
      failed += batches[b].length;
    }
  }
  console.log(`\nDone! Translated: ${done}, Failed: ${failed}, Total RU: ${Object.keys(ru).length}`);
}

main().catch(console.error);
