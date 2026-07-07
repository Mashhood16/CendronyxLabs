import { readFileSync } from 'fs';
const c = readFileSync('src/data/class12Theorems.tsx', 'utf8');
const lines = c.split('\n');

// Look for lines with `detail:` or `keyInsight:` or `finalFormulaDesc:` that have \\ (backslash) followed by LaTeX commands
let total = 0;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const trimmed = l.trim();
  
  // Only check plain-text fields (detail, keyInsight, finalFormulaDesc)
  if (!trimmed.startsWith('detail:') && !trimmed.startsWith('keyInsight:') && 
      !trimmed.startsWith('finalFormulaDesc:')) continue;
  
  // Find \\x patterns (backslash + letter) that are NOT \\' (already fixed)
  const matches = trimmed.match(/\\\\[a-z]/gi);
  if (matches) {
    const filtered = matches.filter(m => m !== "\\'");  // \\' was already fixed
    if (filtered.length > 0) {
      console.log(`LINE ${i+1}: ${filtered.join(', ')} → ${trimmed.substring(0, 120)}`);
      total++;
    }
  }
}

console.log(`\nTotal lines with backslash LaTeX commands in plain text: ${total}`);
