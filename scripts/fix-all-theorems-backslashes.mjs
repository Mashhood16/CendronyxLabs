import { readFileSync, writeFileSync } from 'fs';

function fixFile(filePath) {
  const c = readFileSync(filePath, 'utf8');
  const lines = c.split('\n');
  let count = 0;

  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    if (!/\b(detail|keyInsight|finalFormulaDesc):/.test(l)) continue;

    const positions = [];
    let inStr = false;
    let strStart = -1;
    for (let j = 0; j < l.length; j++) {
      if (l[j] === "'" && (j === 0 || l[j - 1] !== '\\')) {
        if (!inStr) { inStr = true; strStart = j; }
        else { inStr = false; positions.push({ start: strStart, end: j }); }
      }
    }

    for (const pos of positions) {
      let inner = l.substring(pos.start + 1, pos.end);
      const orig = inner;

      inner = inner.replace(/\\(?:lim|sum|angle)(?!\w)/g, m => m.substring(1));
      inner = inner.replace(/\\(?:to)(?!\w)/g, '\u2192');
      inner = inner.replace(/\\(?:Rightarrow)(?!\w)/g, '\u21D2');
      inner = inner.replace(/\\(?:cdot)(?!\w)/g, '\u00B7');
      inner = inner.replace(/\\(?:frac|text|left|right|displaystyle)\s*/g, '');

      if (inner !== orig) {
        l = l.substring(0, pos.start + 1) + inner + l.substring(pos.end);
        count++;
      }
    }

    lines[i] = l;
  }

  writeFileSync(filePath, lines.join('\n'));
  return count;
}

const files = ['class9Theorems.tsx', 'class10Theorems.tsx', 'class11Theorems.tsx', 'class12Theorems.tsx'];
for (const f of files) {
  const p = 'src/data/' + f;
  const n = fixFile(p);
  console.log(f + ': ' + n + ' lines fixed');
}
