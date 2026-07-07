/**
 * Script to convert formula strings to LaTeX-friendly notation
 * in derivation data files (class11Derivations.tsx, class12Derivations.tsx)
 */
import { readFileSync, writeFileSync } from 'fs';

const FILES = [
  'src/data/class11Derivations.tsx',
  'src/data/class12Derivations.tsx',
];

/** Apply LaTeX conversions to a formula string */
function convertFormula(f) {
  let s = f;

  // Convert common fractions: (1/2) -> \\frac{1}{2}
  s = s.replace(/\(1\/2\)/g, '\\\\frac{1}{2}');
  s = s.replace(/\(1\/3\)/g, '\\\\frac{1}{3}');
  s = s.replace(/\(2\/3\)/g, '\\\\frac{2}{3}');
  s = s.replace(/\(3\/2\)/g, '\\\\frac{3}{2}');

  // Convert 2pi -> 2\\pi, 4pi -> 4\\pi
  s = s.replace(/\b2pi\b/g, '2\\\\pi');
  s = s.replace(/\b4pi\b/g, '4\\\\pi');

  // Convert standalone words that should be \\text{} in formulas
  s = s.replace(/\bconstant\b/g, '\\\\text{constant}');
  s = s.replace(/\btotal\b/g, '\\\\text{total}');
  s = s.replace(/\bfinal\b/g, '\\\\text{final}');
  s = s.replace(/\binitial\b/g, '\\\\text{initial}');
  s = s.replace(/\bmaximum\b/g, '\\\\text{max}');
  s = s.replace(/\bminimum\b/g, '\\\\text{min}');
  s = s.replace(/\baverage\b/g, '\\\\text{avg}');

  return s;
}

/** Process a file: find all `formula:` values and convert */
function processFile(filepath) {
  const content = readFileSync(filepath, 'utf-8');
  let modified = content;

  // Match formula: '...'
  const singleQuoteRegex = /(formula:\s*)'([^']*?)'/g;
  modified = modified.replace(singleQuoteRegex, (match, prefix, formula) => {
    const converted = convertFormula(formula);
    if (converted !== formula) {
      return `${prefix}'${converted}'`;
    }
    return match;
  });

  // Match formula: "..."
  const doubleQuoteRegex = /(formula:\s*)"([^"]*?)"/g;
  modified = modified.replace(doubleQuoteRegex, (match, prefix, formula) => {
    const converted = convertFormula(formula);
    if (converted !== formula) {
      return `${prefix}"${converted}"`;
    }
    return match;
  });

  if (modified !== content) {
    writeFileSync(filepath, modified);
    console.log('Updated: ' + filepath);
    const changes = (modified.match(/\\\\frac/gi) || []).length;
    const piChanges = (modified.match(/\\\\pi/gi) || []).length;
    const textChanges = (modified.match(/\\\\text/g) || []).length;
    console.log('  Total LaTeX: ' + (changes + piChanges + textChanges) + ' constructs');
  } else {
    console.log('No changes needed: ' + filepath);
  }
}

for (const file of FILES) {
  processFile(file);
}

console.log('\nDone!');
