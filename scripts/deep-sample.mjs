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
const longTexts = textStrs.filter(k => en[k].length >= 20);

console.log('=== First 100 remaining long text strings ===');
longTexts.slice(0, 100).forEach((k, i) => {
  console.log(`${i+1}. [${k}] ${en[k].substring(0, 130)}`);
});

console.log('\n\n=== Remaining short labels (first 60) ===');
const shortLabels = textStrs.filter(k => en[k].length < 20);
shortLabels.slice(0, 60).forEach((k, i) => {
  console.log(`${i+1}. [${k}] ${en[k].substring(0, 50)}`);
});
