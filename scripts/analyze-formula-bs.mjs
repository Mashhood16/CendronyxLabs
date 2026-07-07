import { readFileSync } from 'fs';
const c = readFileSync('src/data/class12Theorems.tsx', 'utf8');

// Find all formula strings (after "formula:" or "finalFormula:")
const regex = /(?:final)?Formula:\s*'(.*?)'|(?:final)?Formula:\s*"(.*?)"/gs;
let match;
let count = 0;
let issues = [];

while ((match = regex.exec(c)) !== null) {
  count++;
  const rawFormula = match[1] || match[2];
  const lineNum = c.substring(0, match.index).split('\n').length;
  
  // Count backslash patterns
  const backslashPairs = (rawFormula.match(/\\\\/g) || []).length;
  const singleBackslash = (rawFormula.match(/(?<!\\)\\(?!\\)/g) || []).length;
  
  // Check for frac patterns
  const hasBareFrac = /(?<!\\)frac\{/.test(rawFormula);
  const hasEscapedFrac = /\\\\frac\{/.test(rawFormula);
  
  // Check for sqrt patterns
  const hasBareSqrt = /(?<!\\)sqrt\{/.test(rawFormula);
  const hasEscapedSqrt = /\\\\sqrt\{/.test(rawFormula);
  
  const summary = rawFormula.substring(0, 80) + (rawFormula.length > 80 ? '...' : '');
  
  if (hasEscapedFrac || hasEscapedSqrt || backslashPairs > 2) {
    issues.push(`LINE ${lineNum}: ${summary}`);
    if (issues.length <= 10) {
      console.log(`LINE ${lineNum}: hasEscapedFrac=${hasEscapedFrac} hasEscapedSqrt=${hasEscapedSqrt} backslashPairs=${backslashPairs}`);
      console.log(`  ${summary}`);
    }
  }
}

console.log(`\nTotal formulas checked: ${count}`);
console.log(`Formulas with potential over-escaping: ${issues.length}`);
