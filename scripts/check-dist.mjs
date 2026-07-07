import fs from 'fs';

const c = fs.readFileSync('dist/assets/index-hE742BZ9.js', 'utf-8');

// Find preprocessFormula or the replacement patterns
const patterns = ['sqrt(', 'bsin', 'bcos', 'btan', 'blog', 'bln', '\\\\sqrt', '\\bsin\\b'];
for (const p of patterns) {
  const idx = c.indexOf(p);
  if (idx >= 0) {
    const start = Math.max(0, idx - 30);
    const end = Math.min(c.length, idx + 40);
    console.log(`Pattern '${p}' found at ${idx}:`);
    console.log('  TEXT:', JSON.stringify(c.slice(start, end)));
    console.log('  HEX:', Buffer.from(c.slice(start, end)).toString('hex'));
    console.log();
  }
}
