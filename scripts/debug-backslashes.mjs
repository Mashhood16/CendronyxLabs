import { readFileSync } from 'fs';

const FILES = ['src/data/class10Theorems.tsx', 'src/data/class9Theorems.tsx'];
const WORDS = ['sin', 'cos', 'tan', 'log', 'ln', 'pi', 'theta', 'alpha', 'beta', 'gamma', 'delta', 'sigma', 'lambda', 'mu', 'omega', 'phi', 'rho'];

for (const filepath of FILES) {
  const content = readFileSync(filepath, 'utf8');
  console.log(`\n=== ${filepath} ===`);
  
  for (const word of WORDS) {
    const idx = content.indexOf('\\\\' + word);
    if (idx >= 0) {
      // Found \\word (2 backslashes + word)
      const ctx = content.substring(Math.max(0, idx - 3), idx + word.length + 3);
      console.log(`  FOUND \\\\${word}: "${ctx}" (char codes: ${[...ctx].map(c => c.charCodeAt(0)).join(',')})`);
    }
  }
  
  // Also check for \\\\word (4 backslashes + word)
  for (const word of WORDS) {
    const idx = content.indexOf('\\\\\\\\' + word);
    if (idx >= 0) {
      const ctx = content.substring(Math.max(0, idx - 3), idx + word.length + 3);
      console.log(`  FOUND \\\\\\\\${word}: "${ctx}" (char codes: ${[...ctx].map(c => c.charCodeAt(0)).join(',')})`);
    }
  }
}
