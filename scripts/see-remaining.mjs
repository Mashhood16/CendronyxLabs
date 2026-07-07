import fs from 'fs';

const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));
const ur = JSON.parse(fs.readFileSync('src/locales/roman-urdu/translation.json', 'utf8'));

const isFormula = (t) => {
  if (!t) return true;
  if (/[→⇌÷×±∞√∫∑πθρΩωΔ²³⁴⁺⁻°₀₁₂₃₄₅₆₇₈₉≈≠≤≥∂]/.test(t)) return true;
  if (/^\d+\.?\d*/.test(t) || /^https?:\/\//.test(t)) return true;
  if (/^\$/.test(t) || /^<[a-z]/.test(t)) return true;
  if (/^[A-Z][a-z]?\d/.test(t)) return true;
  if (/^[a-z]\s*=\s*/.test(t)) return true;
  if (t.includes('&&') || t.includes('Math.') || /\\frac|\\sqrt/.test(t)) return true;
  return false;
};

const same = Object.keys(en).filter(k => {
  const ev = (en[k] || '').trim();
  const uv = (ur[k] || '').trim();
  return ev && (!uv || uv === ev);
});
const textStrs = same.filter(k => !isFormula(en[k]));

// Show distribution by key prefix
const prefixCount = {};
textStrs.forEach(k => {
  const parts = k.split('.');
  const prefix = parts.slice(0, 2).join('.');
  prefixCount[prefix] = (prefixCount[prefix] || 0) + 1;
});

console.log('Remaining text strings:', textStrs.length);
console.log('\n=== Distribution by prefix ===');
Object.entries(prefixCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30)
  .forEach(([k, v]) => console.log(`${k}: ${v}`));
