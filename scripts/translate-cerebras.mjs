import { readFileSync, writeFileSync, existsSync } from 'fs';

const BATCH_SIZE = 150;
const BATCH_DELAY_MS = 500;
const EN = './src/locales/en/translation.json';
const RU = './src/locales/roman-urdu/translation.json';

const KEY = process.env.CEREBRAS_API_KEY;
if (!KEY) { console.error('No Cerebras key'); process.exit(1); }

const en = JSON.parse(readFileSync(EN, 'utf8'));
let ru = {};
if (existsSync(RU)) { try { ru = JSON.parse(readFileSync(RU, 'utf8')); console.log(`Loaded ${Object.keys(ru).length}`); } catch(e) {} }

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function chunk(a, s) { const c=[]; for(let i=0; i<a.length; i+=s) c.push(a.slice(i,i+s)); return c; }

async function translate(entries) {
  const text = entries.map(([k,v], i)=>`[${i}] ${v}`).join('\n');
  const prompt = `Translate these to Roman Urdu (Urdu in English alphabet). Keep protected words: Modules, History, Settings, Home, Search, Class, Curriculum, Lab, Calculator, Simulation, Derivation, Input, Output, Score, Mass, Current, Velocity, Force, Acceleration, Momentum, Physics, Chemistry, Biology, Math, Pressure, Density, Voltage, Resistance, Energy, Power, Gravity, Magnet, Ohm, Watt, Joule, Newton, Pascal. Keep ALL {vars}, numbers, units EXACT. Return JSON array.

${text}`;

  for (let a=0; a<3; a++) {
    try {
      const r = await fetch('https://api.cerebras.ai/v1/chat/completions', {
        method:'POST',
        headers: {'Authorization':`Bearer ${KEY}`, 'Content-Type':'application/json'},
        body: JSON.stringify({
          model: 'llama3.1-8b',
          messages: [{role:'system',content:'Roman Urdu translator. Output JSON only.'},{role:'user',content:prompt}],
          temperature: 0.1, max_tokens: 8192
        })
      });
      if (!r.ok) {
        const e = await r.text();
        if (r.status===429) { console.log('  Rate limited...'); await sleep(10000); continue; }
        throw new Error(`HTTP ${r.status}: ${e.substring(0,200)}`);
      }
      const d = await r.json();
      let c = d.choices[0].message.content.trim();
      if (c.startsWith('```json')) c=c.replace(/^```json\n?/,'').replace(/\n?```$/,'');
      else if (c.startsWith('```')) c=c.replace(/^```\n?/,'').replace(/\n?```$/,'');
      const t = JSON.parse(c);
      if (!Array.isArray(t) || t.length !== entries.length) throw new Error(`Expected ${entries.length}, got ${t.length}`);
      return t;
    } catch(e) {
      console.error(`  Attempt ${a+1}: ${e.message.substring(0,100)}`);
      if (a<2) await sleep(5000*(a+1));
      else throw e;
    }
  }
}

async function main() {
  const keys = Object.keys(en).filter(k => ru[k] === undefined);
  const total = Object.keys(en).length;
  console.log(`To translate: ${keys.length}/${total}`);
  const batches = chunk(keys, BATCH_SIZE);
  let done = 0;
  
  for (let b=0; b<batches.length; b++) {
    console.log(`\nBatch ${b+1}/${batches.length}`);
    try {
      const t = await translate(batches[b].map(k=>[k,en[k]]));
      for (let j=0; j<batches[b].length; j++) ru[batches[b][j]] = t[j];
      done += batches[b].length;
      const sorted = Object.keys(ru).sort();
      const obj={}; for (const k of sorted) obj[k]=ru[k];
      writeFileSync(RU, JSON.stringify(obj, null, 2), 'utf8');
      console.log(`  ✓ ${Math.round(Object.keys(ru).length/total*100)}%`);
      if (b<batches.length-1) await sleep(BATCH_DELAY_MS);
    } catch(e) {
      console.error(`  ✗ ${e.message.substring(0,80)}`);
    }
  }
  console.log(`\nDone! RU keys: ${Object.keys(ru).length}`);
}

main().catch(console.error);
