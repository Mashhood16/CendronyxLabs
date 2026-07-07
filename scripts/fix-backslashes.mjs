import { readFileSync, writeFileSync } from 'fs';

const files = ['src/data/class10Theorems.tsx', 'src/data/class9Theorems.tsx'];

for (const f of files) {
  let c = readFileSync(f, 'utf8');
  const orig = c;
  
  // Match 3+ consecutive backslash chars followed by a letter (or more letters)
  // Replace with exactly 2 backslash chars followed by the same letters
  // This normalizes \\\\log -> \\log etc.
  // We need to work byte-by-byte since backslashes in regex are tricky
  let result = '';
  let i = 0;
  while (i < c.length) {
    // Count consecutive backslashes
    let bsCount = 0;
    while (i < c.length && c[i] === '\\') {
      bsCount++;
      i++;
    }
    // If we had 3+ backslashes and next char is a letter
    if (bsCount >= 3 && i < c.length && /[a-zA-Z]/.test(c[i])) {
      // Replace with exactly 2 backslashes
      result += '\\\\';
    } else {
      // Keep original count
      result += '\\'.repeat(bsCount);
    }
    // Continue with rest of characters
    while (i < c.length && c[i] !== '\\') {
      result += c[i];
      i++;
    }
  }
  
  writeFileSync(f, result, 'utf8');
  const changes = [...result].filter((ch, j) => ch !== orig[j]).length;
  console.log(`${f}: ${changes} character${changes !== 1 ? 's' : ''} changed`);
}
