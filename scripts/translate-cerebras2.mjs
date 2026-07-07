// Cerebras-based batch translation (very fast inference)
import { readFileSync, writeFileSync, existsSync } from 'fs';

const BATCH_SIZE = 100;
const EN = './src/locales/en/translation.json';
const RU = './src/locales/roman-urdu/translation.json';
const PROTECTED = './scripts/protected-words.json';

const KEY = process.env.CEREBRAS_API_KEY;
if (!KEY) { console.error('No Cerebras key'); process.exit(1); }

const en = JSON.parse(readFileSync(EN, 'utf8'));
const protectedWords = JSON.parse(readFileSync(PROTECTED, 'utf8'));
let ru = {};
if (existsSync(RU)) { try { ru = JSON.parse(readFileSync(RU, 'utf8')); } catch(e) { ru = {}; } }

const enKeys = Object.keys(en);
const totalKeys = enKeys.length;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function chunk(a, s) { const c=[]; for(let i=0; i<a.length; i+=s) c.push(a.slice(i,i+s)); return c; }

async function translateBatch(entries) {
  const text = entries.map((e, i) => `${i+1}. ${e.value}`).join('\n');
  const prompt = `Translate these ${entries.length} English sentences to Roman Urdu (Urdu in Latin alphabet). NEVER translate these words: ${protectedWords.join(', ')}. Keep {vars}, numbers, units, formulas intact. Return ONLY a JSON array of strings.\n\n${text}`;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch('https://api.cerebras.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemma-4-31b',
          messages: [
            { role: 'system', content: 'Roman Urdu translator. Output JSON only.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.05,
          max_tokens: 8192,
        })
      });
      
      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 429) { console.log('  ⏳ Rate limited...'); await sleep(10000); continue; }
        console.log(`  ⚠️ HTTP ${res.status}: ${errText.substring(0, 100)}`);
        await sleep(5000); continue;
      }
      
      const data = await res.json();
      let content = data.choices[0].message.content.trim();
      
      if (content.startsWith('```json')) content = content.replace(/^```json\n?/,'').replace(/\n?```$/,'');
      else if (content.startsWith('```')) content = content.replace(/^```\n?/,'').replace(/\n?```$/,'');
      
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) content = jsonMatch[0];
      
      const translations = JSON.parse(content);
      if (!Array.isArray(translations)) throw new Error('Not array');
      if (translations.length !== entries.length) throw new Error(`Expected ${entries.length}, got ${translations.length}`);
      return translations;
    } catch(e) {
      console.error(`  ❌ Attempt ${attempt+1}: ${e.message.substring(0, 100)}`);
      await sleep(3000 * (attempt+1));
    }
  }
  throw new Error('All failed');
}

async function main() {
  const toTranslate = enKeys.filter(k => ru[k] === undefined);
  console.log(`Total: ${totalKeys}, RU: ${Object.keys(ru).length}, To do: ${toTranslate.length}`);
  
  if (toTranslate.length === 0) { console.log('Nothing to translate!'); return; }
  
  const batches = chunk(toTranslate, BATCH_SIZE);
  console.log(`Batches: ${batches.length}`);
  
  for (let b = 0; b < batches.length; b++) {
    const entries = batches[b].map(k => ({ key: k, value: en[k] }));
    process.stdout.write(`[${b+1}/${batches.length}] `);
    
    try {
      const translations = await translateBatch(entries);
      for (let j = 0; j < entries.length; j++) ru[entries[j].key] = translations[j];
      
      const sorted = Object.keys(ru).sort();
      const obj = {};
      for (const k of sorted) obj[k] = ru[k];
      writeFileSync(RU, JSON.stringify(obj, null, 2), 'utf8');
      
      const pct = Math.round(Object.keys(ru).length / totalKeys * 100);
      console.log(`✅ ${Object.keys(ru).length}/${totalKeys} = ${pct}%`);
      
      if (b < batches.length - 1) await sleep(500);
    } catch(e) {
      console.log(`❌ ${e.message.substring(0, 80)}`);
      await sleep(5000);
    }
  }
  
  console.log(`\nDone! RU: ${Object.keys(ru).length}/${totalKeys}`);
  const missing = enKeys.filter(k => ru[k] === undefined);
  if (missing.length > 0) console.log(`Missing: ${missing.length}`);
}

main().catch(console.error);
