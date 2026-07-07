import fs from 'fs';

const c = fs.readFileSync('src/components/MathFormula.tsx', 'utf-8');

// Find ALL lines with '.replace('
const lines = c.split('\n');
for (const line of lines) {
  if (line.includes('.replace(')) {
    // Extract the second argument (the replacement string)
    const m = line.match(/\.replace\([^,]+,\s*'([^']+)'/);
    if (m) {
      const replacement = m[1];
      console.log('REPLACEMENT:', JSON.stringify(replacement));
      console.log('HEX:', Buffer.from(replacement).toString('hex'));
      console.log('Char codes:', [...replacement].map(c => c.charCodeAt(0).toString(16)).join(' '));
      console.log();
    }
  }
}
