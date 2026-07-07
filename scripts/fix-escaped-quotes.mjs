import { readFileSync, writeFileSync } from 'fs';
const filePath = 'src/data/class12Theorems.tsx';
let content = readFileSync(filePath, 'utf8');

// Find lines with \\' (backslash backslash quote) pattern
const lines = content.split('\n');
let fixed = 0;
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  let newLine = l;
  
  // Replace \\' with a smart apostrophe inside single-quoted strings
  // Strategy: Use a right single quotation mark (U+2019) instead of \\'
  newLine = newLine.replace(/\\\\'/g, '\u2019');
  
  if (newLine !== l) {
    console.log(`Line ${i+1}: fixed`);
    fixed++;
    lines[i] = newLine;
  }
}

writeFileSync(filePath, lines.join('\n'));
console.log(`Fixed ${fixed} lines.`);
