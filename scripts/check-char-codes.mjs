import fs from 'fs';

// Read a specific formula and show every byte
const c = fs.readFileSync('src/data/class11Derivations.tsx', 'utf-8');

// Find the formula that produces the HTML pattern `(vi)\times`
// Looking for a formula with )\times pattern
const lines = c.split('\n');
for (const line of lines) {
  if (line.includes('times') && line.includes(')')) {
    // Show the raw bytes of the formula value
    const m = line.match(/((?:final)?formula:\s*')([^']*)'/);
    if (m) {
      const formula = m[2];
      // Show every character with its code
      const chars = [...formula].map((ch, i) => {
        const code = ch.charCodeAt(0);
        const display = ch === '\n' ? '\\n' : ch === '\t' ? '\\t' : ch === '\r' ? '\\r' : ch;
        return `${i}: '${display}' (${code.toString(16)})`;
      });
      console.log('=== Formula ===');
      console.log(formula);
      console.log('--- Char breakdown ---');
      console.log(chars.join('\n'));
      console.log();
      break;
    }
  }
}
