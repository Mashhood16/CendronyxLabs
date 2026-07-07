import { readFileSync } from 'fs';
const c = readFileSync('src/data/class12Theorems.tsx', 'utf8');
const lines = c.split('\n');
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  // Find lines with backslash+singlequote (\\')
  for (let j = 0; j < l.length - 1; j++) {
    if (l[j] === '\\' && l[j+1] === "'") {
      console.log(`Line ${i+1}, col ${j+1}: ${l.trim().substring(0, 120)}`);
      break;
    }
  }
}
