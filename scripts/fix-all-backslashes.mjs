import { readFileSync, writeFileSync } from 'fs';
const c = readFileSync('src/data/class12Theorems.tsx', 'utf8');
const lines = c.split('\n');
let count = 0;

for (let i = 0; i < lines.length; i++) {
  let l = lines[i];
  
  // Only process lines with plain-text fields (detail, keyInsight, finalFormulaDesc)
  if (!/\b(detail|keyInsight|finalFormulaDesc):/.test(l)) continue;
  
  // Track single-quoted string positions (handle escaped quotes: \\')
  const positions = [];
  let inStr = false;
  let strStart = -1;
  for (let j = 0; j < l.length; j++) {
    if (l[j] === "'" && (j === 0 || l[j-1] !== '\\')) {
      if (!inStr) {
        inStr = true;
        strStart = j;
      } else {
        inStr = false;
        positions.push({ start: strStart, end: j });
      }
    }
  }
  
  // For each single-quoted string on this line
  for (const pos of positions) {
    let inner = l.substring(pos.start + 1, pos.end);
    let orig = inner;
    
    // CORRECTED regex: \\\\ matches a literal backslash, followed by LaTeX command words
    // Replace \\lim, \\sum, \\angle, \\to, \\Rightarrow, \\cdot with plain equivalents
    inner = inner.replace(/\\(?:lim|sum|angle)(?!\w)/g, (m) => m.substring(1)); // remove backslash, keep word
    
    // \\to -> arrow character
    inner = inner.replace(/\\(?:to)(?!\w)/g, '\u2192');
    
    // \\Rightarrow -> double arrow
    inner = inner.replace(/\\(?:Rightarrow)(?!\w)/g, '\u21D2');
    
    // \\cdot -> middle dot
    inner = inner.replace(/\\(?:cdot)(?!\w)/g, '\u00B7');
    
    // Remove \\frac, \\text, \\left, \\right, \\displaystyle (with optional trailing space)
    inner = inner.replace(/\\(?:frac|text|left|right|displaystyle)\s*/g, '');
    
    if (inner !== orig) {
      l = l.substring(0, pos.start + 1) + inner + l.substring(pos.end);
      count++;
    }
  }
  
  lines[i] = l;
}

writeFileSync('src/data/class12Theorems.tsx', lines.join('\n'));
console.log(`Fixed ${count} lines.`);
