// Final translation - Cerebras with proper Roman Urdu prompt
import { readFileSync, writeFileSync, existsSync } from 'fs';

const BATCH_SIZE = 60;
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

// Detect Urdu script
function isUrduScript(text) {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

// Get keys that need translation: missing OR in Urdu script
function getWorkKeys() {
  const missing = enKeys.filter(k => ru[k] === undefined);
  const urduKeys = enKeys.filter(k => k in ru && isUrduScript(ru[k]));
  return { missing, urduKeys };
}

async function translateBatch(entries) {
  // entries: [{ key, value }]
  const text = entries.map((e, i) => `${i+1}. ${e.value}`).join('\n');
  const protectedStr = protectedWords.join(', ');
  
  const prompt = `Translate these ${entries.length} English sentences to Roman Urdu.

CRITICAL RULES:
1. Roman Urdu uses ONLY English/Latin letters (a-z, A-Z). NEVER use Urdu/Arabic script.
2. NEVER translate these words: ${protectedStr}
3. Keep {variables}, numbers, units, formulas, HTML, emojis, [brackets] EXACTLY as-is
4. Examples: "Select Class"→"Class muntakhib karein", "Check Answer"→"Jawab check karein", "Theory"→"Nazriya", "Lab"→"Lab", "Instructions"→"Hidayat", "Assessment"→"Tashkhees"
5. Output ONLY a valid JSON array of strings in the same order.

Sentences:
${text}`;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch('https://api.cerebras.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemma-4-31b',
          messages: [
            { role: 'system', content: 'You translate English to Roman Urdu (Latin alphabet only). Output JSON arrays only.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.05,
          max_tokens: 8192,
        })
      });
      
      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 429) { console.log('  ⏳ Rate limited...'); await sleep(15000); continue; }
        console.log(`  ⚠️ HTTP ${res.status}: ${errText.substring(0,100)}`);
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
      console.error(`  ❌ Attempt ${attempt+1}: ${e.message.substring(0,100)}`);
      await sleep(5000 * (attempt+1));
    }
  }
  throw new Error('All failed');
}

async function main() {
  const { missing, urduKeys } = getWorkKeys();
  console.log(`Total EN: ${totalKeys}, Current RU: ${Object.keys(ru).length}`);
  console.log(`Missing: ${missing.length}, Urdu-script to fix: ${urduKeys.length}`);
  
  // Process all work keys together
  const allWork = [...missing, ...urduKeys];
  console.log(`Total work: ${allWork.length}`);
  
  if (allWork.length === 0) { console.log('Nothing to do!'); return; }
  
  const batches = chunk(allWork, BATCH_SIZE);
  console.log(`Batches: ${batches.length}`);
  
  let translated = 0, failed = 0;
  
  for (let b = 0; b < batches.length; b++) {
    const k = batches[b];
    const entries = k.map(key => ({ key, value: en[key] }));
    
    process.stdout.write(`[${b+1}/${batches.length}] `);
    
    try {
      const translations = await translateBatch(entries);
      for (let j = 0; j < entries.length; j++) ru[entries[j].key] = translations[j];
      translated += entries.length;
      
      // Save after each batch
      const sorted = Object.keys(ru).sort();
      const obj = {};
      for (const key of sorted) obj[key] = ru[key];
      writeFileSync(RU, JSON.stringify(obj, null, 2), 'utf8');
      
      const { missing: m, urduKeys: u } = getWorkKeys();
      console.log(`✅ ${Object.keys(ru).length}/${totalKeys} (missing: ${m.length}, urdu: ${u.length})`);
      
      if (b < batches.length - 1) await sleep(1000);
    } catch(e) {
      console.log(`❌ ${e.message.substring(0,80)}`);
      failed += entries.length;
      await sleep(10000);
    }
  }
  
  console.log(`\nDone! RU: ${Object.keys(ru).length}/${totalKeys}`);
  const { missing: m, urduKeys: u } = getWorkKeys();
  console.log(`Still missing: ${m.length}, Still Urdu: ${u.length}`);
  if (m.length === 0 && u.length === 0) console.log('🎉 ALL DONE!');
}

main().catch(console.error);
