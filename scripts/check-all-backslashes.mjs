import { readFileSync } from 'fs';

const files = [
  'src/data/class9Theorems.tsx',
  'src/data/class10Theorems.tsx',
  'src/data/class11Theorems.tsx',
  'src/data/class12Theorems.tsx'
];

for (const file of files) {
  console.log(`\n=== ${file} ===`);
  const c = readFileSync(file, 'utf8');
  const lines = c.split('\n');
  let issues = 0;

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    
    // Skip non-string lines (imports, JSX tags, comments)
    const trimmed = l.trim();
    if (trimmed.startsWith('import ') || trimmed.startsWith('//') || 
        trimmed.startsWith('*') || trimmed.startsWith('function ') ||
        trimmed.startsWith('}') || trimmed.startsWith('export') ||
        trimmed.startsWith('<') || trimmed.endsWith('{') ||
        trimmed.includes('useState') || trimmed.includes('Math.')) {
      continue;
    }

    // Check for \\' in single-quoted strings (problematic for oxc parser)
    // We need to find lines with two consecutive backslashes followed by a single quote
    for (let j = 0; j < l.length - 2; j++) {
      if (l[j] === '\\' && l[j+1] === '\\' && l[j+2] === "'") {
        // Verify this is inside a single-quoted string (the line starts with content that opens a single quote)
        const before = l.substring(0, j);
        const singleQuoteCount = (before.match(/'/g) || []).length;
        // Odd count means we're inside a single-quoted string
        if (singleQuoteCount % 2 === 1) {
          console.log(`  LINE ${i+1} (col ${j+1}): \\\\' inside single-quoted string`);
          console.log(`    ${trimmed.substring(0, 150)}`);
          issues++;
        }
      }
    }
  }
  
  if (issues === 0) {
    console.log('  No issues found.');
  } else {
    console.log(`  ${issues} issue(s) found.`);
  }
}
