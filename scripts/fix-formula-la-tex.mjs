import { readFileSync, writeFileSync } from 'fs';

// Words that preprocessFormula handles with word-boundary (\b) regex
// In the file, they appear as \\\\word (4 backslash chars + word = 2 backslashes in actual string)
// We need to replace \\\\word with word so preprocessFormula can add \\word
const AUTO_CONVERT = [
  'sin', 'cos', 'tan', 'log', 'ln', 'pi',
  'theta', 'omega', 'alpha', 'rho', 'phi', 'beta', 'eta',
  'mu', 'lambda', 'sigma', 'delta', 'gamma', 'tau', 'kappa',
  'chi', 'psi', 'epsilon', 'zeta', 'nu', 'xi', 'iota',
  'Theta', 'Omega', 'Sigma', 'Delta', 'Gamma', 'Lambda', 'Phi', 'Psi',
];

const FILES = ['src/data/class10Theorems.tsx', 'src/data/class9Theorems.tsx'];

let totalChanges = 0;

for (const filepath of FILES) {
  let content = readFileSync(filepath, 'utf8');
  const original = content;

  // Build replacement: \\\\word → word (literal string replacement)
  const bs = String.fromCharCode(92); // single backslash
  for (const word of AUTO_CONVERT) {
    // Match 4 consecutive backslashes + word in the raw file content
    const oldStr = bs + bs + bs + bs + word;
    // Replace all occurrences of \\\\word with just word
    content = content.split(oldStr).join(word);
  }

  if (content !== original) {
    writeFileSync(filepath, content, 'utf8');
    let count = 0;
    const origLines = original.split('\n');
    const updLines = content.split('\n');
    for (let i = 0; i < origLines.length; i++) {
      if (origLines[i] !== updLines[i]) count++;
    }
    totalChanges += count;
    console.log(`${filepath}: ${count} lines changed`);
  } else {
    console.log(`${filepath}: No changes`);
  }
}

console.log(`\nTotal: ${totalChanges} lines changed across ${FILES.length} files`);
