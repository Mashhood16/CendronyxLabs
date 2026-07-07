import fs from 'fs';

const c = fs.readFileSync('src/components/MathFormula.tsx', 'utf-8');

// Find the line containing the sqrt replacement
const lines = c.split('\n');
for (const line of lines) {
  if (line.includes('sqrt(') && line.includes('replace')) {
    console.log('LINE:', JSON.stringify(line));
    console.log('HEX:', Buffer.from(line).toString('hex'));
    console.log();
  }
  if (line.includes('sin(') && line.includes('replace')) {
    console.log('SIN LINE:', JSON.stringify(line));
    console.log('SIN HEX:', Buffer.from(line).toString('hex'));
    console.log();
  }
  if (line.includes('text{') && line.includes('replace')) {
    console.log('CONSTANT LINE:', JSON.stringify(line));
    console.log('CONSTANT HEX:', Buffer.from(line).toString('hex'));
    console.log();
  }
}

// Also check the fraction regex
for (const line of lines) {
  if (line.includes('frac{') && line.includes('replace')) {
    console.log('FRAC LINE:', JSON.stringify(line));
    console.log('FRAC HEX:', Buffer.from(line).toString('hex'));
    console.log();
  }
}
