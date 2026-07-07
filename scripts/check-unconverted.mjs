import fs from 'fs';

const files = ['src/data/class11Derivations.tsx', 'src/data/class12Derivations.tsx'];

for (const file of files) {
  const c = fs.readFileSync(file, 'utf-8');
  // Find all formula: and finalFormula: values
  const formulaRegex = /((?:final)?formula:\s*')([^']*)'/g;
  let match;
  const issues = [];
  
  while ((match = formulaRegex.exec(c)) !== null) {
    const formula = match[2];
    const full = match[0];
    
    // Check for plain x as multiplication
    // But exclude: v_x, x_, x_o, x², x^{, etc.
    if (/ x /.test(formula) && !/\\\\times/.test(formula)) {
      issues.push('PLAIN_X: ' + full.substring(0, 100));
    }
    
    // Check for (1/2) that isn't \frac
    if (/\(1\/2\)/.test(formula) && !/\\\\frac/.test(formula)) {
      issues.push('PLAIN_FRAC: ' + full.substring(0, 100));
    }
    
    // Check for sqrt without backslash
    if (/\bsqrt\b/.test(formula) && !/\\\\sqrt/.test(formula)) {
      issues.push('PLAIN_SQRT: ' + full.substring(0, 100));
    }
    
    // Check for 2pi without backslash
    if (/\b2pi\b/.test(formula) && !/\\\\pi/.test(formula)) {
      issues.push('PLAIN_PI: ' + full.substring(0, 100));
    }
  }
  
  console.log(`\n=== ${file} ===`);
  if (issues.length === 0) {
    console.log('  No issues found!');
  } else {
    for (const issue of issues) {
      console.log('  ' + issue);
    }
  }
}
