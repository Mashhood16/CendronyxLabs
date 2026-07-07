import fs from 'fs';

const c = fs.readFileSync('dist/assets/index-hE742BZ9.js', 'utf-8');

// Look for replacement strings with backslashes used in preprocessFormula
const searchTerms = [
  'sqrt{$',        // \\sqrt{$1} compiled
  '\\\\sqrt',       // literal \\\\sqrt in JS
  '\\\\sin',        // literal sin replacement
  '\\\\times',       // times replacement
  '\\\\theta',      // theta replacement  
  '\\\\rho',        // rho replacement
  '\\\\text',       // text command
  '\\\\frac',       // frac command
  '\\\\pi',         // pi replacement
];

for (const term of searchTerms) {
  let idx = 0;
  let count = 0;
  while ((idx = c.indexOf(term, idx)) >= 0 && count < 2) {
    const start = Math.max(0, idx - 20);
    const end = Math.min(c.length, idx + 30);
    console.log(`'${term}' at ${idx}:`);
    console.log('  TEXT:', JSON.stringify(c.slice(start, end)));
    console.log('  HEX:', Buffer.from(c.slice(start, end)).toString('hex'));
    count++;
    idx++;
  }
  if (count > 0) console.log();
}
