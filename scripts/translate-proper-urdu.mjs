// scripts/translate-proper-urdu.mjs
// Uses OpenRouter with Gemini 2.0 Flash to produce proper Roman Urdu translations
// with correct SOV (Subject-Object-Verb) word order
import fs from 'fs';
import { readFileSync, writeFileSync } from 'fs';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_KEY) { console.error('No OPENROUTER_API_KEY'); process.exit(1); }

const EN = './src/locales/en/translation.json';
const RU = './src/locales/roman-urdu/translation.json';
const PROTECTED = './scripts/protected-words.json';

const en = JSON.parse(readFileSync(EN, 'utf8'));
const ru = JSON.parse(readFileSync(RU, 'utf8'));
const protectedWords = JSON.parse(readFileSync(PROTECTED, 'utf8'));

// Additional scientific/technical terms that should stay in English
const SCIENCE_TERMS = [
  'CuSO₄', 'NaOH', 'HCl', 'H₂O', 'H₂SO₄', 'NaCl', 'CO₂', 'O₂', 'N₂',
  'Molarity', 'molarity', 'Stock', 'stock', 'Distilled', 'distilled',
  'Voltage', 'voltage', 'Current', 'current', 'Resistance', 'resistance',
  'Force', 'force', 'Velocity', 'velocity', 'Mass', 'mass',
  'Acceleration', 'acceleration', 'Momentum', 'momentum',
  'Energy', 'energy', 'Power', 'power', 'Pressure', 'pressure',
  'Temperature', 'temperature', 'Density', 'density', 'Volume', 'volume',
  'Solution', 'solution', 'Concentration', 'concentration',
  'Equation', 'equation', 'Formula', 'formula', 'Graph', 'graph',
  'Data', 'data', 'Procedure', 'procedure', 'Observation', 'observation',
  'Result', 'result', 'Analysis', 'analysis',
  'Incorrect', 'incorrect', 'Correct', 'correct', 'Reset', 'reset',
  'Calculate', 'calculate', 'Record', 'record', 'Measure', 'measure',
  'Add', 'add', 'Dilute', 'dilute', 'Observe', 'observe', 'Click', 'click',
  'Initial', 'initial', 'Final', 'final', 'Total', 'total',
  'Increment', 'increment', 'Log', 'log', 'Diagram', 'diagram',
  'Interactive', 'interactive', 'Simulation', 'simulation',
  'Circuit', 'circuit', 'Table', 'table', 'Check', 'check',
  'Answer', 'answer', 'Score', 'score', 'Step', 'step',
  'Unit', 'unit', 'Chapter', 'chapter', 'Section', 'section',
  'Class', 'class', 'Subject', 'subject', 'Module', 'module',
  'Lab', 'lab', 'Experiment', 'experiment', 'Theory', 'theory',
  'Practice', 'practice', 'Setup', 'setup', 'Controls', 'controls',
  'Input', 'input', 'Output', 'output', 'Value', 'value',
  'Standard', 'standard', 'Sample', 'sample', 'Trial', 'trial',
  'Average', 'average', 'Mean', 'mean', 'Median', 'median',
  'Mode', 'mode', 'Range', 'range', 'Deviation', 'deviation',
  'Error', 'error', 'Margin', 'margin', 'Percent', 'percent',
  'Ratio', 'ratio', 'Proportion', 'proportion', 'Rate', 'rate',
  'Constant', 'constant', 'Variable', 'variable', 'Parameter', 'parameter',
  'Axis', 'axis', 'Slope', 'slope', 'Intercept', 'intercept',
  'Function', 'function', 'Derivative', 'derivative', 'Integral', 'integral',
  'Limit', 'limit', 'Theorem', 'theorem', 'Proof', 'proof',
  'pH', 'Acid', 'acid', 'Base', 'base', 'Salt', 'salt',
  'Electron', 'electron', 'Proton', 'proton', 'Neutron', 'neutron',
  'Atom', 'atom', 'Molecule', 'molecule', 'Ion', 'ion',
  'Element', 'element', 'Compound', 'compound', 'Mixture', 'mixture',
  'Cell', 'cell', 'Tissue', 'tissue', 'Organ', 'organ',
  'DNA', 'RNA', 'Gene', 'gene', 'Protein', 'protein',
  'Enzyme', 'enzyme', 'Bacteria', 'bacteria', 'Virus', 'virus',
  'Graph', 'graph', 'Chart', 'chart', 'Plot', 'plot',
  'Serial', 'serial', 'Parallel', 'parallel', 'Series', 'series',
  'Primary', 'primary', 'Secondary', 'secondary',
  'Qualitative', 'qualitative', 'Quantitative', 'quantitative',
  'Hypothesis', 'hypothesis', 'Conclusion', 'conclusion',
  'Method', 'method', 'Technique', 'technique', 'Apparatus', 'apparatus',
  'mL', 'L', 'g', 'kg', 'mg', 'm', 'cm', 'mm', 'km',
  's', 'min', 'h', 'hr', 'A', 'V', 'Ω', 'W', 'J', 'N', 'Pa',
  'Hz', 'C', 'K', 'mol', 'cd', 'lux', 'Gy', 'Sv',
  'M₁', 'V₁', 'M₂', 'V₂', 'v₁', 'v₂', 't₁', 't₂',
];

// Find keys that need translation (currently English, not formulas or UI labels)
function needsTranslation(k, ev, rv) {
  if (!ev || !rv || rv !== ev) return false; // already has RU
  if (ev.length < 8) return false; // too short
  if (k.startsWith('nav.') || k.startsWith('status.')) return false;
  if (k === 'class.platform_name' || k === 'class.platform_tagline') return false;
  if (k.startsWith('lab.verb.')) return false;
  // Skip pure formula strings
  if (/^[\d\s(){}\[\]{}|:;,.%°^=+\-*\/<>\w.]+$/.test(ev) && ev.length < 40) return false;
  return true;
}

const toTranslate = Object.keys(en).filter(k => needsTranslation(k, en[k], ru[k]));
console.log('Keys to translate:', toTranslate.length);

// Batch translation with OpenRouter
const BATCH_SIZE = 25;
function chunk(a, s) { const c=[]; for(let i=0; i<a.length; i+=s) c.push(a.slice(i,i+s)); return c; }
const batches = chunk(toTranslate, BATCH_SIZE);
console.log('Batches:', batches.length);

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function escapeJson(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
}

async function translateBatch(entries) {
  const protectedStr = [...new Set([...protectedWords, ...SCIENCE_TERMS])].join(', ');
  
  const numberedText = entries.map((k, i) => `[${i}] ${en[k]}`).join('\n');
  
  const systemPrompt = `You are a high-quality Roman Urdu translator for educational science content.

CRITICAL RULES:
1. Translate English to Roman Urdu (Urdu written in Latin alphabet).
2. Use proper Urdu sentence structure: Subject-Object-Verb (verb at the END of the sentence).
3. NEVER translate these protected scientific/technical terms: ${protectedStr}
   Keep them EXACTLY as-is in English.
4. Keep ALL {variables}, numbers, units (m, s, kg, A, V, Ω, N, J, W, Pa, Hz, C, K, mol, cd), $LaTeX$, formulas, HTML entities, emojis, and [brackets] EXACTLY as-is.
5. Translate common English words to Roman Urdu: the→(skip/remove), a/an→(skip/remove), and→aur, with→ke saath, of→ka/ki/ke, for→ke liye, to→ko, in→mein, on→par, at→pe, by→se/ke zariye, from→se, is/are/am→hai/hain, was/were→tha/the/thi, have/has→hai/rakhta/rakhti, do/does→karta/karti/karte, will→ga/ge/gi, can→sakta/sakti/sakte, should→chahiye, must→lazmi, may→ho sakta, need→zaroorat, want→chahiye, use→istamal, make→banana, take→lena, give→dena, put→rakhna, get→milna, know→jana, think→sochna, say→kehna, see→dekhta, come→aana, go→jana, find→dhudna, tell→batana, this→ye, that→woh, these→ye, those→woh, here→yahan, there→wahan, now→ab, then→tab, always→hamesha, never→kabhi nahi, often→aksar, sometimes→kabhi kabhi, very→bohat, much→bohat, many→bohat, some→kuch, few→kuch, all→tamam/sab, every→har, each→har, both→dono, also→bhi, only→sirf, just→bas, about→ke baare mein, not→nahi, yes→haan, no→nahi, good→acha, bad→bura, big→bara, small→chota, new→naya, old→purana, first→pehla, last→akhri, next→agla, same→ek jaisa, different→mukhtalif, important→ahem, necessary→zaroori, possible→mumkin, easy→asan, difficult→mushkil, simple→saada, complex→pechida, correct→sahi, incorrect→ghalat, right→sahi, wrong→ghalat, true→sach, false→jhoot.

6. Output ONLY a valid JSON array of strings. One string per input item. No numbering, no prefixes.

EXAMPLE:
Input: [0] Dilution is the process of decreasing the concentration.
Output: ["Dilution, concentration ko kam karne ka amal hai."]`;

  const userPrompt = `Translate each of these ${entries.length} texts to natural Roman Urdu with proper SOV word order. Return ONLY a JSON array:\n\n${numberedText}`;

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.1,
          max_tokens: 4096,
        })
      });
      
      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 429) {
          const wait = Math.min(60000, 5000 * Math.pow(2, attempt));
          console.log(`  Rate limited, waiting ${wait/1000}s...`);
          await sleep(wait);
          continue;
        }
        console.log(`  HTTP ${res.status}: ${errText.substring(0, 100)}`);
        await sleep(10000);
        continue;
      }
      
      const data = await res.json();
      let content = data.choices?.[0]?.message?.content?.trim();
      if (!content) {
        console.log(`  Empty response, retrying...`);
        await sleep(5000);
        continue;
      }
      
      // Clean markdown code fences
      if (content.startsWith('```json')) content = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      else if (content.startsWith('```')) content = content.replace(/^```\n?/, '').replace(/\n?```$/, '');
      
      // Extract JSON array
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) content = jsonMatch[0];
      
      const translations = JSON.parse(content);
      if (!Array.isArray(translations)) throw new Error('Not an array');
      if (translations.length !== entries.length)
        throw new Error(`Expected ${entries.length}, got ${translations.length}`);
      
      return translations;
    } catch(e) {
      console.error(`  Attempt ${attempt+1}: ${e.message.substring(0, 100)}`);
      await sleep(5000 * (attempt + 1));
    }
  }
  throw new Error('All attempts failed');
}

async function main() {
  let totalTranslated = 0;
  let consecutiveErrors = 0;
  
  for (let b = 0; b < batches.length; b++) {
    const entries = batches[b];
    const startIdx = b * BATCH_SIZE + 1;
    console.log(`\n[${b+1}/${batches.length}] Batch ${startIdx}-${startIdx+entries.length-1} (${entries.length} items)`);
    
    try {
      const translations = await translateBatch(entries);
      
      for (let j = 0; j < entries.length; j++) {
        const key = entries[j];
        const translation = translations[j];
        if (translation && translation !== en[key]) {
          ru[key] = translation;
          totalTranslated++;
        }
      }
      
      consecutiveErrors = 0;
      
      // Save after each batch
      const sorted = Object.keys(ru).sort();
      const obj = {};
      for (const k of sorted) obj[k] = ru[k];
      writeFileSync(RU, JSON.stringify(obj, null, 2), 'utf8');
      
      console.log(`  ${totalTranslated}/${toTranslate.length} translated (${Math.round(b/batches.length*100)}%)`);
      
      if (b < batches.length - 1) await sleep(1000);
    } catch(e) {
      console.error(`  Batch ${b+1} failed: ${e.message.substring(0, 100)}`);
      consecutiveErrors++;
      if (consecutiveErrors >= 5) {
        console.log('Too many consecutive errors, stopping');
        break;
      }
      await sleep(15000);
    }
  }
  
  console.log(`\nDone! ${totalTranslated} keys translated to proper Roman Urdu.`);
  const diffCount = Object.keys(en).filter(k => en[k] && ru[k] && ru[k] !== en[k]).length;
  console.log(`Total keys different from EN: ${diffCount}`);
}

main().catch(console.error);
