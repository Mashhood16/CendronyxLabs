/**
 * Carefully fix formula LaTeX in derivation data files.
 * Only applies safe transformations within formula:'...' and finalFormula:'...' strings.
 * 
 * Fixes:
 * 1. ` x ` → ` \\times ` (space-x-space used as multiplication)
 * 2. `m^-1` → `m^{-1}`, `v^2` → `v^{2}` (braces for multi-char exponents)
 * 3. `g^(-1/2)` → `g^{-1/2}` (parens→braces in exponents, PRESERVING caret)
 */
import fs from 'fs';

const files = [
  'src/data/class11Derivations.tsx',
  'src/data/class12Derivations.tsx'
];

let totalModified = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;
  
  // Process each formula value independently using a replace callback
  content = content.replace(
    /((?:final)?formula:\s*')([^']*)(')/g,
    (match, prefix, formula, suffix) => {
      let f = formula;
      
      // 1. Replace ` x ` (space-x-space, multiplication operator) with ` \\times `
      //    This is safe because variable names like x_o, x², v_x never have spaces around them
      f = f.replace(/ x /g, ' \\\\times ');
      
      // 2. Fix unbraced multi-char exponents: letter^digits → letter^{digits}
      //    e.g., v^2 → v^{2}, h^1 → h^{1}, m^-1 → m^{-1}
      f = f.replace(/([a-zA-Z])\^(-?\d+)(?!\})/g, '$1^{$2}');
      
      // 3. Fix parens-style exponents: letter^(expr) → letter^{expr}
      //    e.g., g^(-1/2) → g^{-1/2}, preserving the caret!
      f = f.replace(/([a-zA-Z])\^\(([^)]+)\)/g, '$1^{$2}');
      
      // 4. Convert sqrt(...) to \\sqrt{...}
      f = f.replace(/sqrt\(([^)]+)\)/g, '\\\\sqrt{$1}');
      
      if (f !== formula) {
        return prefix + f + suffix;
      }
      return match; // no change, return original
    }
  );
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    totalModified++;
    console.log(`✅ ${filePath}: Fixed`);
  } else {
    console.log(`❌ ${filePath}: No changes`);
  }
}

console.log(`\nDone! ${totalModified} files updated.`);
