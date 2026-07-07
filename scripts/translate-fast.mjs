// Fast batch translation using OpenRouter free models
import { readFileSync, writeFileSync, existsSync } from 'fs';

const BATCH_SIZE = 300;
const EN = './src/locales/en/translation.json';
const RU = './src/locales/roman-urdu/translation.json';
const PROTECTED = './scripts/protected-words.json';

const KEY = process.env.OPENROUTER_API_KEY;
if (!KEY) { console.error('No OpenRouter key'); process.exit(1); }

const en = JSON.parse(readFileSync(EN, 'utf8'));
const protectedWords = JSON.parse(readFileSync(PROTECTED, 'utf8'));
let ru = {};
if (existsSync(RU)) { try { ru = JSON.parse(readFileSync(RU, 'utf8')); } catch(e) {} }

const enKeys = Object.keys(en);
const totalKeys = enKeys.length;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function chunk(a, s) { const c=[]; for(let i=0; i<a.length; i+=s) c.push(a.slice(i,i+s)); return c; }

const models = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'google/gemma-4-26b-a4b-it:free',
  'qwen/qwen3-coder:free',
];

async function translateBatch(entries) {
  const text = entries.map((e, i) => `${i+1}. ${e.value}`).join('\n');
  
  const systemPrompt = `You translate English text to Roman Urdu (Urdu written in English/Latin alphabet).
Rules:
- NEVER translate: ${protectedWords.slice(0, 50).join(', ')}
- Keep ALL {variables}, numbers, units (m/s, kg, N, J, Pa, °C, mL, g, mol, A, V, Ω, Hz), HTML entities, emojis, [brackets], chemical formulas EXACTLY as-is
- Translate the meaning naturally to colloquial Roman Urdu
- Examples: "Select Class" → "Class muntakhib karein", "Check Answer" → "Jawab check karein", "Next Step" → "Agla qadam", "Instructions" → "Hidayat", "Theory" → "Nazriya"
- Return ONLY a JSON array of strings, one translation per input line, in order`;

  for (let attempt = 0; attempt < models.length + 2; attempt++) {
    const model = models[attempt % models.length];
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://virtuallab.app',
          'X-Title': 'VirtualLab'
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Translate these ${entries.length} sentences to Roman Urdu. Return ONLY a JSON array of strings:\n\n${text}` }
          ],
          temperature: 0.05,
          max_tokens: 16000,
        })
      });
      
      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 429) {
          console.log(`  ⏳ Rate limited on ${model}, waiting...`);
          await sleep(20000);
          continue;
        }
        console.log(`  ⚠️ HTTP ${res.status} on ${model}: ${errText.substring(0, 100)}`);
        await sleep(5000);
        continue;
      }
      
      const data = await res.json();
      let content = data.choices[0].message.content.trim();
      
      if (content.startsWith('```json')) content = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      else if (content.startsWith('```')) content = content.replace(/^```\n?/, '').replace(/\n?```$/, '');
      
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) content = jsonMatch[0];
      
      const translations = JSON.parse(content);
      if (!Array.isArray(translations)) throw new Error('Response is not an array');
      if (translations.length !== entries.length) throw new Error(`Expected ${entries.length} translations, got ${translations.length}`);
      
      return translations;
    } catch(e) {
      console.error(`  ❌ Attempt ${attempt + 1} (${model}): ${e.message.substring(0, 120)}`);
      await sleep(3000 * (attempt + 1));
    }
  }
  throw new Error('All attempts failed');
}

async function main() {
  const toTranslate = enKeys.filter(k => ru[k] === undefined);
  console.log(`Total: ${totalKeys}, RU: ${Object.keys(ru).length}, To translate: ${toTranslate.length}`);
  
  const batches = chunk(toTranslate, BATCH_SIZE);
  console.log(`Batches: ${batches.length}`);
  
  for (let b = 0; b < batches.length; b++) {
    const entries = batches[b].map(k => ({ key: k, value: en[k] }));
    console.log(`\n[${b+1}/${batches.length}] Keys ${b*BATCH_SIZE+1}-${Math.min((b+1)*BATCH_SIZE, toTranslate.length)}...`);
    
    try {
      const translations = await translateBatch(entries);
      for (let j = 0; j < entries.length; j++) {
        ru[entries[j].key] = translations[j];
      }
      
      const sorted = Object.keys(ru).sort();
      const obj = {};
      for (const k of sorted) obj[k] = ru[k];
      writeFileSync(RU, JSON.stringify(obj, null, 2), 'utf8');
      
      const pct = Math.round(Object.keys(ru).length / totalKeys * 100);
      console.log(`  ✅ ${Object.keys(ru).length}/${totalKeys} = ${pct}%`);
      
      if (b < batches.length - 1) await sleep(3000);
    } catch(e) {
      console.error(`  ❌ Batch ${b+1} failed: ${e.message.substring(0, 100)}`);
      await sleep(10000);
    }
  }
  
  console.log(`\n🎉 Done! RU keys: ${Object.keys(ru).length}`);
  const stillMissing = enKeys.filter(k => ru[k] === undefined);
  if (stillMissing.length > 0) {
    console.log(`⚠️ Missing: ${stillMissing.length} keys`);
  }
}

main().catch(console.error);
