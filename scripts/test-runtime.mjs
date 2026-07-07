// Simulate what KaTeX receives: read the raw file, extract a formula string,
// then evaluate it as if JS parsed the string literal

import fs from 'fs';

// Read the raw file
const raw = fs.readFileSync('src/data/class11Derivations.tsx', 'utf-8');

// Find formulas with \times in them
const formulaRegex = /((?:final)?formula:\s*)'((?:[^'\\]|\\.)*)'/g;
let match;
let count = 0;

while ((match = formulaRegex.exec(raw)) !== null) {
  const rawFormulaContent = match[2]; // raw text between quotes
  
  // Simulate JS string literal unescaping
  // In JS single-quoted strings: \\ -> \, \' -> ', \n -> newline, \t -> tab, etc.
  let jsValue = '';
  for (let i = 0; i < rawFormulaContent.length; i++) {
    if (rawFormulaContent[i] === '\\' && i + 1 < rawFormulaContent.length) {
      const next = rawFormulaContent[i + 1];
      if (next === '\\') { jsValue += '\\'; i++; }
      else if (next === "'") { jsValue += "'"; i++; }
      else if (next === 'n') { jsValue += '\n'; i++; }
      else if (next === 't') { jsValue += '\t'; i++; } // TAB!
      else if (next === 'r') { jsValue += '\r'; i++; }
      else { jsValue += '\\' + next; i++; }
    } else {
      jsValue += rawFormulaContent[i];
    }
  }
  
  // Check if the formula contains literal \times
  if (rawFormulaContent.includes('\\times')) {
    count++;
    // The raw content has \times (two backslashes). After JS parsing:
    // \\ -> \
    // So \t in \times... wait, after escaping: \\\\t in raw -> \\ -> \, then t -> t
    // So \\times in raw content: \\ -> \, then times -> times
    // JS value: \times
    
    // Check what char is at the position of the first backslash
    const bsIdx = rawFormulaContent.indexOf('\\');
    if (bsIdx >= 0) {
      const hex6 = rawFormulaContent.substring(bsIdx, bsIdx + 6);
      const chars = [...hex6].map(c => `'${c}'(${c.charCodeAt(0).toString(16)})`).join(' ');
      console.log(`Raw chars: ${chars}`);
      
      const jsSimulated = jsValue.substring(bsIdx, bsIdx + 5);
      const jsChars = [...jsSimulated].map(c => `'${c}'(${c.charCodeAt(0).toString(16)})`).join(' ');
      console.log(`After JS parse: ${jsChars}`);
      console.log(`Contains tab? ${jsSimulated.includes('\t') ? 'YES - TAB FOUND!' : 'No tab'}`);
      console.log(`Contains \\\\t? ${jsSimulated.includes('\\t') ? 'YES - literal \\t' : 'No literal \\t'}`);
      console.log();
    }
  }
}

console.log(`Total formulas with times: ${count}`);
